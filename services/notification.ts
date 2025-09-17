import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configuration des notifications
Notifications.setNotificationHandler( {
  handleNotification: async () => ( {
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  } ),
} );

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

  // Demander les permissions
  async requestPermissions (): Promise<boolean> {
    if ( !Device.isDevice ) {
      console.log( 'Must use physical device for push notifications' );
      return false;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if ( existingStatus !== 'granted' ) {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if ( finalStatus !== 'granted' ) {
      console.log( 'Failed to get push token for push notification!' );
      return false;
    }

    return true;
  }

  // Programmer une notification quotidienne
  async scheduleDailyNotification ( time: string, enabled: boolean ) {
    // Annuler l'ancienne notification quotidienne
    await this.cancelNotification( 'daily-reminder' );

    if ( !enabled ) return;

    const [ hours, minutes ] = time.split( ':' ).map( Number );

    // Vérifier que l'heure est valide
    if ( hours < 0 || hours > 23 || minutes < 0 || minutes > 59 ) {
      console.error( 'Invalid time format' );
      return;
    }

    await Notifications.scheduleNotificationAsync( {
      identifier: 'daily-reminder',
      content: {
        title: "C'est l'heure de s'entraîner ! 💪",
        body: "N'oubliez pas votre séance d'aujourd'hui",
        data: { type: 'daily-reminder' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    } );

    console.log( `Notification quotidienne programmée à ${time}` );
  }

  // Programmer une notification à 18h spécifiquement
  async scheduleDailyReminderAt6PM ( enabled: boolean ) {
    await this.scheduleDailyNotification( "22:03", enabled );
  }

  // Programmer une notification pour demain à une heure donnée (pour test)
  async scheduleNextDayNotification ( time: string ) {
    const [ hours, minutes ] = time.split( ':' ).map( Number );

    const tomorrow = new Date();
    tomorrow.setDate( tomorrow.getDate() + 1 );
    tomorrow.setHours( hours, minutes, 0, 0 );

    await Notifications.scheduleNotificationAsync( {
      identifier: 'next-day-test',
      content: {
        title: "Test notification de demain ! 🔔",
        body: `Notification programmée pour ${time}`,
        data: { type: 'test' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: tomorrow,
      },
    } );

    console.log( `Notification de test programmée pour demain à ${time}` );
  }

  // Annuler une notification
  async cancelNotification ( identifier: string ) {
    await Notifications.cancelScheduledNotificationAsync( identifier );
  }

  // Annuler toutes les notifications
  async cancelAllNotifications () {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  // Obtenir les notifications programmées
  async getScheduledNotifications () {
    return await Notifications.getAllScheduledNotificationsAsync();
  }

  // Notification immédiate (pour les tests)
  async sendImmediateNotification ( title: string, body: string ) {
    await Notifications.scheduleNotificationAsync( {
      content: {
        title,
        body,
        data: { type: 'immediate' },
      },
      trigger: null,
    } );
  }

  // Vérifier si une notification est programmée
  async isDailyNotificationScheduled (): Promise<boolean> {
    const scheduledNotifications = await this.getScheduledNotifications();
    return scheduledNotifications.some( notif => notif.identifier === 'daily-reminder' );
  }
}