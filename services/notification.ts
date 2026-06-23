import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Configuration des notifications
 */
Notifications.setNotificationHandler( {
  handleNotification: async () => ( {
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  } ),
} );

// Identifiant fixe pour la notification de fin de repos.
// Un seul repos actif à la fois, donc un seul identifiant suffit
// (on annule/remplace plutôt que d'en accumuler plusieurs).
const REST_END_NOTIFICATION_ID = "rest-end-notification";

export interface NotificationPreferences {
  dailyReminder: boolean;
  dailyTime: string; // Format "HH:MM"
  workoutReminder: boolean;
  progressUpdates: boolean;
}

export class NotificationService {
  private static instance: NotificationService;

  public static getInstance (): NotificationService {
    if ( !NotificationService.instance ) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Crée le canal de notification Android (obligatoire sur Android 8+
   * pour que les notifications s'affichent correctement). Sans cet appel,
   * les notifications peuvent être ignorées ou dégradées sur certains
   * appareils/versions Android. Sans effet sur iOS.
   */
  async setupAndroidChannel () {
    if ( Platform.OS !== "android" ) return;

    await Notifications.setNotificationChannelAsync( "default", {
      name: "Notifications",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [ 0, 250, 250, 250 ],
      sound: "default",
    } );
  }

  /**
   * Demande les permissions de notifications
   * @returns true si les permissions sont acceptées, false sinon
   */
  async requestPermissions (): Promise<boolean> {
    if ( !Device.isDevice ) {
      console.log( "Must use physical device for push notifications" );
      return false;
    }

    // Le canal doit exister avant la première notification sur Android
    await this.setupAndroidChannel();

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if ( existingStatus !== "granted" ) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if ( finalStatus !== "granted" ) {
      console.log( "Failed to get push token for push notification!" );
      return false;
    }

    return true;
  }

  /**
   * Programme la prochaine notification et configure la récurrence
   * @param time heure de la notification
   * @param enabled permet d'activer ou de désactiver la notification
   */
  async scheduleDailyNotification ( time: string, enabled: boolean ) {
    // Annuler l'ancienne notification quotidienne
    await this.cancelNotification( "daily-reminder" );

    if ( !enabled ) return;

    const [ hours, minutes ] = time.split( ":" ).map( Number );

    // Vérifier que l'heure est valide
    if ( hours < 0 || hours > 23 || minutes < 0 || minutes > 59 ) {
      console.error( "Invalid time format" );
      return;
    }

    if ( Platform.OS === "ios" ) {
      // Sur iOS, on peut utiliser le trigger calendar
      await Notifications.scheduleNotificationAsync( {
        identifier: "daily-reminder",
        content: {
          title: "C'est l'heure de s'entraîner ! 💪",
          body: "N'oubliez pas votre séance d'aujourd'hui",
          data: { type: "daily-reminder" },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: hours,
          minute: minutes,
          repeats: true,
        },
      } );
    } else {
      // Sur Android, on programme une série de notifications avec des dates spécifiques
      await this.scheduleAndroidDailyNotifications( time );
    }

    console.log( `Notification quotidienne programmée à ${time} (${Platform.OS})` );
  }

  /**
   * Programme une série de notifications pour Android (30 jours)
   * @param time heure de la notification
   */
  private async scheduleAndroidDailyNotifications ( time: string ) {
    const [ hours, minutes ] = time.split( ":" ).map( Number );
    const scheduled: string[] = [];

    for ( let day = 0; day < 30; day++ ) {
      try {
        const notificationDate = new Date();
        notificationDate.setDate( notificationDate.getDate() + day );
        notificationDate.setHours( hours, minutes, 0, 0 );

        if ( notificationDate > new Date() ) {
          await Notifications.scheduleNotificationAsync( {
            identifier: `daily-reminder-${day}`,
            content: {
              title: "C'est l'heure de s'entraîner ! 💪",
              body: "N'oublie pas ta séance d'aujourd'hui",
              data: { type: "daily-reminder" },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: notificationDate,
            },
          } );
          scheduled.push( `daily-reminder-${day}` );
        }
      } catch ( error ) {
        console.error( `Failed to schedule notification for day ${day}:`, error );
      }
    }

    console.log( `Successfully scheduled ${scheduled.length}/30 notifications` );
  }

  /**
   * Permet de programmer une notification à une heure spécifique
   * @param enabled permet d'activer ou de désactiver cette notifications
   */
  async scheduleDailyReminderAt6PM ( enabled: boolean ) {
    await this.scheduleDailyNotification( "18:00", enabled );
  }

  /**
   * Annuler une notifications
   * @param identifier l'id de la notification
   */
  async cancelNotification ( identifier: string ) {
    await Notifications.cancelScheduledNotificationAsync( identifier );
  }

  /**
   * Annule toutes les notifications quotidiennes (iOS et Android)
   */
  async cancelDailyNotifications () {
    if ( Platform.OS === "ios" ) {
      await this.cancelNotification( "daily-reminder" );
    } else {
      // Sur Android, annuler toutes les notifications quotidiennes
      const scheduledNotifications = await this.getScheduledNotifications();
      for ( const notif of scheduledNotifications ) {
        if ( notif.identifier.startsWith( "daily-reminder" ) ) {
          await this.cancelNotification( notif.identifier );
        }
      }
    }
  }

  /**
   * Permet d'annuler toute les notifications
   */
  async cancelAllNotifications () {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Permet d'obtenir toute les notifications programmées
   * @returns retourner les notifications programmées
   */
  async getScheduledNotifications () {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Permet d'envoyer une notification immédiate pour les tests
   * @param title titre de la notification
   * @param body contenu de la notification
   */
  async sendImmediateNotification ( title: string, body: string ) {
    await Notifications.scheduleNotificationAsync( {
      content: {
        title,
        body,
        data: { type: "immediate" },
      },
      trigger: null,
    } );
  }

  /**
   * Vérifie si une notification quotidienne est programmée
   * @returns retourne si une notification quotidienne est programmée
   */
  async isDailyNotificationScheduled (): Promise<boolean> {
    const scheduledNotifications = await this.getScheduledNotifications();

    if ( Platform.OS === "ios" ) {
      return scheduledNotifications.some( notif => notif.identifier === "daily-reminder" );
    } else {
      return scheduledNotifications.some( notif => notif.identifier.startsWith( "daily-reminder" ) );
    }
  }

  /**
   * Méthode de maintenance pour renouveler les notifications Android
   * À appeler périodiquement (par exemple au lancement de l'app)
   */
  async renewAndroidNotifications () {
    if ( Platform.OS !== "android" ) return;

    const scheduledNotifications = await this.getScheduledNotifications();
    const dailyNotifications = scheduledNotifications.filter( notif =>
      notif.identifier.startsWith( "daily-reminder" )
    );

    // Si il reste moins de 7 notifications, en reprogrammer
    if ( dailyNotifications.length < 7 ) {
      console.log( "Renouvellement des notifications Android nécessaire" );
      // Vous pouvez récupérer l'heure depuis les préférences utilisateur
      // et relancer scheduleDailyNotification
    }
  }

  /**
   * Programme une notification locale ponctuelle qui se déclenche
   * dans `seconds` secondes, pour signaler la fin du repos.
   * Annule toute notification de repos déjà programmée avant d'en
   * programmer une nouvelle (évite les doublons si on relance un repos).
   * @param seconds - délai en secondes avant déclenchement
   */
  async scheduleRestEndNotification ( endTime: number ) {
    // On annule d'abord une éventuelle notif de repos précédente
    await this.cancelRestEndNotification();

    try {
      await Notifications.scheduleNotificationAsync( {
        identifier: REST_END_NOTIFICATION_ID,
        content: {
          title: "Repos terminé ! 💪",
          body: "C'est le moment de reprendre l'exercice.",
          data: { type: "rest-end" },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date( endTime ),
        },
      } );
    } catch ( error ) {
      console.error( "Erreur lors de la programmation de la notification de repos:", error );
    }
  }

  /**
   * Annule la notification de fin de repos si elle est programmée.
   * À appeler quand le repos est terminé normalement, passé manuellement,
   * ou si la session est interrompue.
   */
  async cancelRestEndNotification () {
    try {
      await this.cancelNotification( REST_END_NOTIFICATION_ID );
    } catch ( error ) {
      console.error( "Erreur lors de l'annulation de la notification de repos:", error );
    }
  }
}