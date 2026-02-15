import { deleteGoal, updateGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { showAlert } from "@/utils/alert";
import { useCallback, useState } from "react";

export function useGoalActions ( goalId: string, totalGoal: number ) {
  const [ isUpdating, setIsUpdating ] = useState( false );
  const [ isDeleting, setIsDeleting ] = useState( false );
  const { updateGoalStore, deleteGoalStore } = useGoalsStore();

  /**
   * Action pour mettre à jour un objectif
   */
  const handleUpdate = useCallback(
    async ( progress: number ) => {
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
    [ goalId, totalGoal, isUpdating, updateGoalStore ]
  );

  const handleDelete = useCallback( async () => {
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
  }, [ goalId, isDeleting, deleteGoalStore ] );

  return {
    handleUpdate,
    handleDelete,
    isUpdating,
    isDeleting,
  };
}