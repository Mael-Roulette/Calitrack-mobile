import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getValue, removeValue, setValue } from "@/utils/local-storage";
import { useEffect, useRef } from "react";
import { SessionSnapshot } from "./useSessionRun";

interface Options {
  trainingId: string;
  ready: boolean; // l'entraînement est chargé
  resume: boolean;
  seriesCount: number;
  snapshot: SessionSnapshot | null;
  onRestore: ( saved: SessionSnapshot ) => void;
}

export function useSessionPersistence ( {
  trainingId,
  ready,
  resume,
  seriesCount,
  snapshot,
  onRestore,
}: Options ) {
  const hasCheckedResume = useRef( false );

  // Restauration une seule fois, dès que l'entraînement est prêt
  useEffect( () => {
    if ( !ready || hasCheckedResume.current ) return;
    hasCheckedResume.current = true;
    if ( !resume ) return;

    const restore = async () => {
      const raw = await getValue( STORAGE_KEYS.TRAINING_IN_PROGRESS );
      if ( !raw ) return;

      let saved: SessionSnapshot & { trainingId: string };
      try {
        saved = JSON.parse( raw );
      } catch {
        await removeValue( STORAGE_KEYS.TRAINING_IN_PROGRESS );
        return;
      }

      if ( saved.trainingId !== trainingId ) return;
      if ( new Date( saved.sessionStartTime ).toDateString() !== new Date().toDateString() ) return;

      // L'entraînement a changé depuis la sauvegarde
      if ( saved.currentSeriesIndex >= seriesCount ) {
        await removeValue( STORAGE_KEYS.TRAINING_IN_PROGRESS );
        return;
      }

      onRestore( saved );
    };
    restore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ready ] );

  // Sauvegarde continue
  useEffect( () => {
    if ( !snapshot ) return;
    setValue(
      STORAGE_KEYS.TRAINING_IN_PROGRESS,
      JSON.stringify( { trainingId, ...snapshot } )
    );
  }, [ snapshot, trainingId ] );

  const clear = () => removeValue( STORAGE_KEYS.TRAINING_IN_PROGRESS );

  return { clear };
}