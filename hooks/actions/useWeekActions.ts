import { createWeek, deleteWeek, duplicateWeek, updateWeek } from "@/lib/week.appwrite";
import { useAuthStore } from "@/store";
import useWeeksStore from "@/store/week.store";
import { Week } from "@/types";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export default function useWeekActions () {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ isUpdating, setIsUpdating ] = useState( false );
  const [ isDeleting, setIsDeleting ] = useState( false );
  const [ isDuplicating, setIsDuplicating ] = useState( false );
  const { addWeekStore, updateWeekStore, deleteWeekStore, weeks } = useWeeksStore();
  const { user } = useAuthStore();

  /**
   * Action pour créer une semaine
   */
  const handleCreate = useCallback( async ( { name, order }: { name: string, order: number } ) => {
    if ( !user ) { showAlert.error( "Utilisateur non connecté" ); return; }
    if ( isSubmitting ) return;

    try {
      setIsSubmitting( true );
      const response = await createWeek( user, { name, order } );

      if ( !response ) { showAlert.error( "Limite de semaines atteinte." ); return; }
      if ( !response.newWeek ) { showAlert.error( response.message.body ); return; }

      await addWeekStore( response.newWeek as unknown as Week );
    } catch ( error ) {
      showAlert.error( error instanceof Error ? error.message : "Une erreur est survenue." );
    } finally {
      setIsSubmitting( false );
    }
  }, [ addWeekStore, isSubmitting, user ] );

  /**
   * Action pour modifier une semaine.
   * Si newOrder est déjà pris, swap automatique avec la semaine conflictuelle.
   */
  const handleUpdate = useCallback( async ( {
    weekId,
    name,
    newOrder,
  }: {
    weekId: string;
    name: string;
    newOrder: number;
  } ) => {
    if ( !user ) { showAlert.error( "Utilisateur non connecté" ); return { success: false }; }
    if ( isUpdating ) return { success: false };

    if ( !name.trim() ) {
      showAlert.error( "Le nom ne peut pas être vide." );
      return { success: false };
    }

    const maxOrder = weeks.length;
    if ( isNaN( newOrder ) || newOrder < 1 || newOrder > maxOrder ) {
      showAlert.error( `L'ordre doit être compris entre 1 et ${maxOrder}.` );
      return { success: false };
    }

    try {
      setIsUpdating( true );

      const response = await updateWeek( weekId, { name: name.trim(), newOrder } );

      if ( !response?.updatedWeek ) {
        showAlert.error( response?.message.body ?? "Erreur lors de la modification." );
        return { success: false };
      }

      updateWeekStore( {
        weekId,
        name: name.trim(),
        newOrder,
        swappedWeekId: response.swappedWeekId,
        oldOrder: response.oldOrder,
      } );

      return { success: true };
    } catch ( error ) {
      showAlert.error( error instanceof Error ? error.message : "Une erreur est survenue." );
      return { success: false };
    } finally {
      setIsUpdating( false );
    }
  }, [ isUpdating, updateWeekStore, weeks, user ] );

  /**
   * Action pour dupliquer une semaine
   */
  const handleDuplicate = useCallback( async ( { weekId }: { weekId: string } ) => {
    if ( !user ) { showAlert.error( "Utilisateur non connecté" ); return; }
    if ( isDuplicating ) return;

    try {
      setIsDuplicating( true );
      const response = await duplicateWeek( user, weekId );

      if ( !response ) { showAlert.error( "Limite de semaines atteinte." ); return; }
      if ( !response.newWeek ) { showAlert.error( response.message.body ); return; }

      await addWeekStore( response.newWeek as unknown as Week );
      return { success: true };
    } catch ( error ) {
      showAlert.error( error instanceof Error ? error.message : "Une erreur est survenue." );
    } finally {
      setIsDuplicating( false );
    }
  }, [ addWeekStore, isDuplicating, user ] );

  /**
   * Action pour supprimer une semaine
   */
  const handleDelete = useCallback( async ( { weekId }: { weekId: string } ) => {
    if ( !user ) { showAlert.error( "Utilisateur non connecté" ); return; }
    if ( isDeleting ) return;

    try {
      setIsDeleting( true );
      await deleteWeek( weekId );
      deleteWeekStore( weekId );
      return { success: true };
    } catch ( error ) {
      console.log( error );
      showAlert.error( error instanceof Error ? error.message : "Une erreur est survenue." );
    } finally {
      setIsDeleting( false );
      router.push( "/(tabs)/weeks" );
    }
  }, [ deleteWeekStore, isDeleting, user ] );

  return {
    handleCreate,
    handleUpdate,
    handleDuplicate,
    handleDelete,
    isSubmitting,
    isUpdating,
    isDuplicating,
    isDeleting,
  };
}
