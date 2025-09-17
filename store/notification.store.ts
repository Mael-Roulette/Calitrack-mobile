// store/notifications.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationService, NotificationPreferences } from '../services/notification';

interface NotificationState {
  // État
  permissions: boolean;
  preferences: NotificationPreferences;
  isLoading: boolean;

  // Actions
  requestPermissions: () => Promise<void>;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>;
  updateDailyNotification: (enabled: boolean, time?: string) => Promise<void>;
  testNotification: () => Promise<void>;
  resetPreferences: () => void;
}

const defaultPreferences: NotificationPreferences = {
  dailyReminder: false,
  dailyTime: '09:00',
  workoutReminder: true,
  progressUpdates: false,
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      // État initial
      permissions: false,
      preferences: defaultPreferences,
      isLoading: false,

      // Demander les permissions
      requestPermissions: async () => {
        set({ isLoading: true });
        try {
          const notificationService = NotificationService.getInstance();
          const granted = await notificationService.requestPermissions();
          set({ permissions: granted });
        } catch (error) {
          console.error('Error requesting permissions:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Mettre à jour les préférences
      updatePreferences: async (newPreferences: Partial<NotificationPreferences>) => {
        const currentPreferences = get().preferences;
        const updatedPreferences = { ...currentPreferences, ...newPreferences };

        set({
          preferences: updatedPreferences,
          isLoading: true
        });

        try {
          const notificationService = NotificationService.getInstance();

          // Mettre à jour la notification quotidienne si elle a changé
          if (
            newPreferences.dailyReminder !== undefined ||
            newPreferences.dailyTime !== undefined
          ) {
            await notificationService.scheduleDailyNotification(
              updatedPreferences.dailyTime,
              updatedPreferences.dailyReminder
            );
          }

          // Vous pouvez aussi sauvegarder en base de données ici
          // await saveNotificationPreferences(updatedPreferences);

        } catch (error) {
          console.error('Error updating preferences:', error);
          // Rollback en cas d'erreur
          set({ preferences: currentPreferences });
        } finally {
          set({ isLoading: false });
        }
      },

      // Mettre à jour spécifiquement la notification quotidienne
      updateDailyNotification: async (enabled: boolean, time?: string) => {
        const currentPreferences = get().preferences;
        const updatedTime = time || currentPreferences.dailyTime;

        set({ isLoading: true });

        try {
          const notificationService = NotificationService.getInstance();

          // Toujours annuler l'ancienne notification d'abord
          await notificationService.cancelNotification('daily-reminder');

          // Programmer la nouvelle si activée
          if (enabled) {
            await notificationService.scheduleDailyNotification(updatedTime, true);
          }

          // Mettre à jour l'état local
          set({
            preferences: {
              ...currentPreferences,
              dailyReminder: enabled,
              dailyTime: updatedTime,
            }
          });

          console.log(`Notification quotidienne ${enabled ? 'programmée' : 'désactivée'} à ${updatedTime}`);

        } catch (error) {
          console.error('Erreur lors de la mise à jour de la notification quotidienne:', error);
          // En cas d'erreur, ne pas changer l'état
        } finally {
          set({ isLoading: false });
        }
      },

      // Tester une notification
      testNotification: async () => {
        try {
          const notificationService = NotificationService.getInstance();
          await notificationService.sendImmediateNotification(
            "Test de notification 🔔",
            "Si vous voyez ceci, les notifications fonctionnent parfaitement !"
          );
        } catch (error) {
          console.error('Error sending test notification:', error);
        }
      },

      // Reset des préférences
      resetPreferences: () => {
        set({ preferences: defaultPreferences });
      },

      // Debug - voir les notifications programmées
      getScheduledNotifications: async () => {
        try {
          const notificationService = NotificationService.getInstance();
          const scheduled = await notificationService.getScheduledNotifications();
          console.log('Notifications programmées:', scheduled);
          return scheduled;
        } catch (error) {
          console.error('Erreur lors de la récupération des notifications:', error);
          return [];
        }
      },
    }),
    {
      name: 'notification-preferences',
      // storage: createJSONStorage(() => AsyncStorage),
      // Ne persister que les préférences, pas l'état loading
      partialize: (state) => ({
        preferences: state.preferences,
        permissions: state.permissions
      }),
    }
  )
);