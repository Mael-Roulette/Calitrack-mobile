/* eslint-disable react-hooks/exhaustive-deps */
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { NotificationService } from "@/services/notification";
import { getBoolean, setBoolean } from "@/utils/local-storage";
import { useCallback, useEffect, useState } from "react";

export const useRestNotificationPreference = () => {
  const [ isAvailable, setIsAvailable ] = useState<boolean>( true );
  const [ isActive, setIsActive ] = useState<boolean>( false );
  const notificationService = NotificationService.getInstance();

  useEffect( () => {
    const init = async () => {
      try {
        const saved = await getBoolean( STORAGE_KEYS.REST_NOTIFICATION_ENABLED, false );
        setIsActive( saved );
        // Si l'utilisateur avait activé la pref mais a retiré la permission
        if ( saved ) {
          const granted = await notificationService.getPermissionStatus();
          setIsAvailable( granted );
          if ( !granted ) setIsActive( false );
        }
      } catch ( error ) {
        console.log( "Erreur init RestNotification:", error );
      }
    };
    init();
  }, [] );

  const toggle = useCallback( async () => {
    const next = !isActive;
    try {
      if ( next ) {
        const granted = await notificationService.requestPermissions();
        setIsAvailable( granted );
        if ( !granted ) return; // refus système, on ne sauvegarde pas le "true"
      }
      setIsActive( next );
      await setBoolean( STORAGE_KEYS.REST_NOTIFICATION_ENABLED, next );
    } catch ( error ) {
      console.log( "Erreur toggle RestNotification:", error );
    }
  }, [ isActive ] );

  return { isAvailable, isActive, toggle };
};