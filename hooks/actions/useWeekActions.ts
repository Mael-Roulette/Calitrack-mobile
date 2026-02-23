import { createWeek, deleteWeek } from "@/lib/week.appwrite";
import { useAuthStore } from "@/store";
import useWeeksStore from "@/store/week.store";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export default function useWeekActions () {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ isDeleting, setIsDeleting ] = useState( false );
  const { addWeekStore , deleteWeekStore } = useWeeksStore();
  const { user } = useAuthStore();

  /**
   * Action pour créer une semaine
   */
  const handleCreate = useCallback( async ( { name, order }: { name: string, order: number } ) => {
    if ( !user ) {
      showAlert.error( "Utilisateur non connecté" );
      return;
    }

    if ( isSubmitting ) return;

    try {
      setIsSubmitting( true );

      const response = await createWeek( user, { name, order } );

      if ( !response!.newWeek ) {
        console.log( response!.message );
        showAlert.error( response!.message.body );
        return;
      }

      addWeekStore( { name, order } );
    } catch ( error ) {
      console.log( error );
      showAlert.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      router.push( "/(tabs)/weeks" );
    }
  }, [ addWeekStore, isSubmitting, user ] );

  const handleDelete = useCallback( async ( { weekId } : { weekId: string } ) => {
    if ( !user ) {
      showAlert.error( "Utilisateur non connecté" );
      return;
    }

    if ( isDeleting ) return;

    try {
      setIsDeleting( true );

      await deleteWeek( weekId );
      deleteWeekStore( weekId );
      return { success: true };
    } catch ( error ) {
      console.log( error );
      showAlert.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setIsDeleting( false );
      router.push( "/(tabs)/weeks" );
    }
  }, [ deleteWeekStore, isDeleting, user ] );

  return {
    handleCreate,
    handleDelete,
    isSubmitting,
    isDeleting,
  };
}
