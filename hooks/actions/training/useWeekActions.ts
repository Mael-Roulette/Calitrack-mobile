import { createWeek, deleteWeek, duplicateWeek, updateWeek } from "@/lib/week.appwrite";
import { useAuthStore } from "@/store";
import useTrainingsStore from "@/store/training.store";
import useWeeksStore from "@/store/week.store";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export default function useWeekActions () {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ isUpdating, setIsUpdating ] = useState( false );
  const [ isDeleting, setIsDeleting ] = useState( false );
  const [ isDuplicating, setIsDuplicating ] = useState( false );
  const { addWeekStore, updateWeekStore, deleteWeekStore, weeks } = useWeeksStore();
  const { refreshTrainings } = useTrainingsStore();
  const { user } = useAuthStore();

  /**
   * Action pour créer une semaine
   */
  const handleCreate = useCallback( async ( { name, order }: { name: string, order: number } ) => {
    if ( !user ) { showAlert.error( "Utilisateur non connecté" ); return { success: false }; }
    if ( isSubmitting ) return { success: false };

    try {
      setIsSubmitting( true );
      const newWeek = await createWeek( user, { name, order } );

      await addWeekStore( newWeek );

      return { success: true };
    } catch ( error ) {
      showAlert.error( error instanceof Error ? error.message : "Une erreur est survenue." );
      return { success: false };
    } finally {
      setIsSubmitting( false );
    }
  }, [ addWeekStore, isSubmitting, user ] );

  /**
   * Action pour modifier une semaine.
   * Si newOrder est déjà pris, swap automatique avec la semaine conflictuelle
   * (le swap est fait côté Appwrite par updateWeek, et répercuté dans le store ici).
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

    const currentWeek = weeks.find( ( w ) => w.$id === weekId );
    if ( !currentWeek ) {
      showAlert.error( "Semaine introuvable." );
      return { success: false };
    }

    const oldOrder = currentWeek.order as number;
    const swappedWeekId = weeks.find(
      ( w ) => w.$id !== weekId && ( w.order as number ) === newOrder
    )?.$id;

    try {
      setIsUpdating( true );

      await updateWeek( weekId, { name: name.trim(), order: newOrder } );

      updateWeekStore( {
        weekId,
        name: name.trim(),
        newOrder,
        swappedWeekId,
        oldOrder,
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
    if ( !user ) { showAlert.error( "Utilisateur non connecté" ); return { success: false }; }
    if ( isDuplicating ) return { success: false };

    try {
      setIsDuplicating( true );
      const newWeek = await duplicateWeek( user, weekId );

      await addWeekStore( newWeek );
      await refreshTrainings();

      return { success: true };
    } catch ( error ) {
      showAlert.error( error instanceof Error ? error.message : "Une erreur est survenue." );
      return { success: false };
    } finally {
      setIsDuplicating( false );
    }
  }, [ addWeekStore, isDuplicating, user, refreshTrainings ] );

  /**
   * Action pour supprimer une semaine
   */
  const handleDelete = useCallback( async ( { weekId }: { weekId: string } ) => {
    if ( !user ) { showAlert.error( "Utilisateur non connecté" ); return { success: false }; }
    if ( isDeleting ) return { success: false };

    try {
      setIsDeleting( true );
      await deleteWeek( weekId );
      deleteWeekStore( weekId );
      return { success: true };
    } catch ( error ) {
      showAlert.error( error instanceof Error ? error.message : "Une erreur est survenue." );
      return { success: false };
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