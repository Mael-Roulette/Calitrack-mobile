import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getBoolean, setBoolean } from "@/utils/storage";
import { useCallback, useEffect, useState } from "react";

export const useRestSoundPreference = () => {
  const [ isActive, setIsActive ] = useState<boolean>( false );

  useEffect( () => {
    const init = async () => {
      try {
        const saved = await getBoolean( STORAGE_KEYS.REST_SOUND_ENABLED, false );
        setIsActive( saved );
      } catch ( error ) {
        console.log( "Erreur init RestSound:", error );
      }
    };
    init();
  }, [] );

  const toggle = useCallback( async () => {
    const next = !isActive;
    setIsActive( next );
    await setBoolean( STORAGE_KEYS.REST_SOUND_ENABLED, next );
  }, [ isActive ] );

  return { isActive, toggle };
};