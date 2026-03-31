import { createTraining, deleteTraining } from "@/lib/training.appwrite";
import { useAuthStore } from "@/store";
import useTrainingsStore from "@/store/training.store";
import { CreateSeriesInput, Training } from "@/types";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

type CreateTrainingInput = {
  weekId: string;
  name: string;
  duration: number;
  days: string[];
  note?: string;
  series: CreateSeriesInput[];
};

export default function useTrainingActions () {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ isDeleting, setIsDeleting ] = useState( false );
  const { addTrainingStore, deleteTrainingStore } = useTrainingsStore();
  const { user } = useAuthStore();

  const handleCreate = useCallback(
    async ( { weekId, name, duration, days, note, series }: CreateTrainingInput ) => {
      if ( !user ) {
        showAlert.error( "Utilisateur non connecté" );
        return { success: false };
      }

      if ( isSubmitting ) return { success: false };

      setIsSubmitting( true );

      try {
        const response = await createTraining( user, weekId, {
          name,
          duration,
          days,
          note,
          series,
        } );

        if ( !response?.newTraining ) {
          showAlert.error(
            response?.message?.body ?? "Erreur lors de la création de l'entraînement."
          );
          return { success: false };
        }

        addTrainingStore( response.newTraining as unknown as Training );

        router.replace( `/week/${weekId}/page` );

        return { success: true, data: response.newTraining };
      } catch ( error ) {
        showAlert.error(
          error instanceof Error ? error.message : "Une erreur est survenue."
        );
        return { success: false };
      } finally {
        setIsSubmitting( false );
      }
    },
    [ isSubmitting, user, addTrainingStore ]
  );

  /**
   * Action pour supprimer un objectif
   */
  const handleDelete = useCallback( async ( { trainingId, weekId } : { trainingId: string, weekId: string } ) => {
    if ( !user ) {
      showAlert.error( "Utilisateur non connecté" );
      return;
    }

    if ( isDeleting ) return { success: false, error: "Suppression en cours" };

    setIsDeleting( true );

    try {
      await deleteTraining( trainingId );
      deleteTrainingStore( trainingId );

      router.replace( `/week/${weekId}/page` );

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
  }, [ user, isDeleting, deleteTrainingStore ] );

  return { handleCreate, handleDelete, isSubmitting, isDeleting };
}
