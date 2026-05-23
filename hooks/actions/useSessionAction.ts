import { saveSession } from "@/lib/session.appwrite";
import { useAuthStore } from "@/store";
import { Performances } from "@/types/session";
import { showAlert } from "@/utils/alert";
import { useCallback, useState } from "react";

export function useSessionActions () {
  const [ isSaving, setIsSaving ] = useState( false );
  const { user } = useAuthStore();

  const handleSave = useCallback(
    async ( {
      trainingId,
      duration,
      note,
      performances,
      onSuccess,
    }: {
      trainingId: string;
      duration: number;
      note?: string;
      performances: Performances;
      onSuccess?: () => void;
    } ) => {
      if ( !user ) {
        showAlert.error( "Utilisateur non connecté" );
        return { success: false };
      }

      if ( isSaving ) return { success: false };

      setIsSaving( true );

      try {
        const session = await saveSession( user, {
          trainingId,
          duration,
          note,
          performances,
        } );

        onSuccess?.();
        return { success: true, data: session };
      } catch ( error ) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Erreur lors de la sauvegarde de la séance.";

        showAlert.error( errorMessage );
        return { success: false, error: errorMessage };
      } finally {
        setIsSaving( false );
      }
    },
    [ isSaving, user ]
  );

  return { handleSave, isSaving };
}