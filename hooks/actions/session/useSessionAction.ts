import { saveSession } from "@/lib/session.appwrite";
import { useAuthStore } from "@/store";
import useSessionsStore from "@/store/session.store";
import { Performances, SessionInput } from "@/types/session";
import { showAlert } from "@/utils/alert";
import { useCallback, useRef, useState } from "react";

export function useSessionActions () {
  const [ isSaving, setIsSaving ] = useState( false );
  const isSavingRef = useRef( false );

  const { user } = useAuthStore();
  const { refreshSessions } = useSessionsStore();

  const handleSave = useCallback(
    async ( {
      session,
      performances,
      onSuccess,
    }: {
      session: SessionInput;
      performances: Performances;
      onSuccess?: () => void;
    } ) => {
      if ( !user ) {
        showAlert.error( "Utilisateur non connecté" );
        return { success: false } as const;
      }

      if ( isSavingRef.current ) return { success: false } as const;

      isSavingRef.current = true;
      setIsSaving( true );

      try {
        const savedSession = await saveSession( user, session, performances );

        // On refresh les sessions du store pour l'affichage dans l'historique notamment
        refreshSessions();

        onSuccess?.();
        return { success: true, data: savedSession } as const;
      } catch ( error ) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors de la sauvegarde de la séance.";

        showAlert.error( errorMessage );
        return { success: false, error: errorMessage } as const;
      } finally {
        isSavingRef.current = false;
        setIsSaving( false );
      }
    }, [ user, refreshSessions ]
  );

  return { handleSave, isSaving };
}