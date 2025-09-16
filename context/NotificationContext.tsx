import { registerForPushNotificationsAsync } from "@/utils/registerPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext( NotificationContext );
  if ( context === undefined ) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ( {
  children,
} ) => {
  const [ expoPushToken, setExpoPushToken ] = useState<string | null>( null );
  const [ notification, setNotification ] =
    useState<Notifications.Notification | null>( null );
  const [ error, setError ] = useState<Error | null>( null );

  // Provide null as initial value to avoid TypeScript error
  const notificationListener = useRef<{ remove (): void } | null>( null );
  const responseListener = useRef<{ remove (): void } | null>( null );

  useEffect( () => {
    let isMounted = true;

    const setupNotifications = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if ( isMounted ) {
          setExpoPushToken( token );
        }
      } catch ( err ) {
        if ( isMounted ) {
          setError( err instanceof Error ? err : new Error( 'Failed to register for push notifications' ) );
        }
      }
    };

    setupNotifications();

    // Set up notification listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener( ( notification ) => {
        console.log( "🔔 Notification Received: ", notification );
        if ( isMounted ) {
          setNotification( notification );
        }
      } );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener( ( response ) => {
        console.log(
          "🔔 Notification Response: ",
          JSON.stringify( response, null, 2 )
        );
        console.log(
          "🔔 Notification Data: ",
          JSON.stringify( response.notification.request.content.data, null, 2 )
        );
        // Handle the notification response here
        // You can add your navigation or other response handling logic
      } );

    return () => {
      isMounted = false;

      // Use remove() method as shown in Expo documentation
      if ( notificationListener.current ) {
        notificationListener.current.remove();
      }
      if ( responseListener.current ) {
        responseListener.current.remove();
      }
    };
  }, [] );

  return (
    <NotificationContext.Provider
      value={ { expoPushToken, notification, error } }
    >
      { children }
    </NotificationContext.Provider>
  );
};