import { createGoal, deleteGoal, updateGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export function useGoalActions () {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ isUpdating, setIsUpdating ] = useState( false );
  const [ isDeleting, setIsDeleting ] = useState( false );
  const { addGoalStore, updateGoalStore, deleteGoalStore } = useGoalsStore();

  /**
   * Action pour créer un objectif
   */
  const handleCreate = useCallback(
    async ( {
      exerciseId,
      total,
      progress,
      onSuccess,
    }: {
      exerciseId: string;
      total: string;
      progress: string;
      onSuccess?: () => void;
    } ) => {
      if ( isSubmitting ) return;

      try {
        if ( !exerciseId ) {
          showAlert.error( "Veuillez sélectionner un mouvement." );
          return;
        }

        const parsedTotal = Number( total );
        const parsedProgress = Number( progress );

        if (
          isNaN( parsedTotal ) ||
          isNaN( parsedProgress ) ||
          parsedTotal <= 0 ||
          parsedProgress < 0
        ) {
          showAlert.error( "Veuillez entrer des valeurs valides." );
          return;
        }

        if ( parsedProgress > parsedTotal ) {
          showAlert.error(
            "La progression ne peut pas être supérieure à l'objectif."
          );
          return;
        }

        setIsSubmitting( true );

        const response = await createGoal( {
          exercise: exerciseId,
          total: parsedTotal,
          progress: parsedProgress,
        } );

        if ( !response.goal ) {
          showAlert.error( response.message.body );
          return;
        }

        addGoalStore( response.goal );
      } catch ( error ) {
        console.log( error );
        showAlert.error(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue."
        );
      } finally {
        router.push( "/(tabs)/goals" );
      }
    },
    [ addGoalStore, isSubmitting ]
  );

  /**
   * Action pour mettre à jour un objectif
   */
  const handleUpdate = useCallback(
    async ( { goalId, progress, totalGoal }: { goalId: string, progress: number, totalGoal: number} ) => {
      if ( isUpdating ) return { success: false, error: "Mise à jour en cours" };

      // Validation
      if ( isNaN( progress ) || progress <= 0 ) {
        showAlert.error( "Veuillez entrer une valeur valide." );
        return { success: false, error: "Valeur invalide" };
      }

      if ( progress > totalGoal ) {
        showAlert.error( "La progression ne peut pas être supérieure à l'objectif." );
        return { success: false, error: "Progression trop élevée" };
      }

      setIsUpdating( true );

      try {
        const updatedGoal = await updateGoal( {
          $id: goalId,
          progress,
        } );

        updateGoalStore( goalId, updatedGoal );
        return { success: true, data: updatedGoal };
      } catch ( error ) {
        console.error( "Erreur mise à jour objectif:", error );
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la mise à jour.";

        showAlert.error( errorMessage );
        return { success: false, error: errorMessage };
      } finally {
        setIsUpdating( false );
      }
    },
    [ isUpdating, updateGoalStore ]
  );

  /**
   * Action pour supprimer un objectif
   */
  const handleDelete = useCallback( async ( { goalId } : { goalId: string } ) => {
    if ( isDeleting ) return { success: false, error: "Suppression en cours" };

    setIsDeleting( true );

    try {
      await deleteGoal( goalId );
      deleteGoalStore( goalId );
      return { success: true };
    } catch ( error ) {
      console.error( "Erreur suppression objectif:", error );
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression.";

      showAlert.error( errorMessage );
      return { success: false, error: errorMessage };
    } finally {
      setIsDeleting( false );
    }
  }, [ isDeleting, deleteGoalStore ] );

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isSubmitting,
    isUpdating,
    isDeleting,
  };
}