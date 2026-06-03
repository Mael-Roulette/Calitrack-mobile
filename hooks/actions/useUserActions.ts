import { updateUser } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { showAlert } from "@/utils/alert";
import { useCallback, useState } from "react";

export function useUserActions () {
  const [ isUpdatingName, setIsUpdatingName ] = useState( false );
  const { refreshUser } = useAuthStore();

  const handleUpdateName = useCallback(
    async ( name: string ) => {
      const trimmed = name.trim();

      if ( !trimmed ) {
        showAlert.error( "Le pseudo ne peut pas être vide." );
        return { success: false };
      }

      if ( isUpdatingName ) return { success: false };

      setIsUpdatingName( true );

      try {
        await updateUser( { name: trimmed } );
        await refreshUser();
        return { success: true };
      } catch ( error ) {
        showAlert.error(
          error instanceof Error ? error.message : "Une erreur est survenue."
        );
        return { success: false };
      } finally {
        setIsUpdatingName( false );
      }
    },
    [ isUpdatingName, refreshUser ]
  );

  return { handleUpdateName, isUpdatingName };
}