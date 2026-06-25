import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getBoolean, setBoolean } from "@/utils/storage";
import * as KeepAwake from "expo-keep-awake";
import { useCallback, useEffect, useState } from "react";

export const useKeepAwakePreference = () => {
  const [ isAvailable, setIsAvailable ] = useState<boolean>( false );
  const [ isActive, setIsActive ] = useState<boolean>( false );

  useEffect( () => {
    const init = async () => {
      try {
        const available = await KeepAwake.isAvailableAsync();
        setIsAvailable( available );
        if ( !available ) return;

        const saved = await getBoolean( STORAGE_KEYS.KEEP_AWAKE_ENABLED, false );
        if ( saved ) {
          await KeepAwake.activateKeepAwakeAsync();
          setIsActive( true );
        }
      } catch ( error ) {
        console.log( "Erreur init KeepAwake:", error );
      }
    };
    init();
  }, [] );

  const toggle = useCallback( async () => {
    const next = !isActive;
    try {
      if ( next ) {
        await KeepAwake.activateKeepAwakeAsync();
      } else {
        await KeepAwake.deactivateKeepAwake();
      }
      setIsActive( next );
      await setBoolean( STORAGE_KEYS.KEEP_AWAKE_ENABLED, next );
    } catch ( error ) {
      console.log( "Erreur toggle KeepAwake:", error );
    }
  }, [ isActive ] );

  return { isAvailable, isActive, toggle };
};