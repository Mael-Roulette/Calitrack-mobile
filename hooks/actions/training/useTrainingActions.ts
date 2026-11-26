import { createTraining, deleteTraining, getUserTrainings, updateTraining, updateTrainingWithSeries } from "@/lib/training.appwrite";
import { useAuthStore } from "@/store";
import useTrainingsStore from "@/store/training.store";
import { CreateTrainingInput, RenameTrainingInput, UpdateTrainingInput } from "@/types";
import { SeriesInput } from "@/types/series";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export default function useTrainingActions () {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ isDeleting, setIsDeleting ] = useState( false );
  const { addTrainingStore, deleteTrainingStore, updateTrainingStore } = useTrainingsStore();
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
        const response = await createTraining( user, {
          weekId,
          name,
          duration,
          days,
          note,
          series,
        } );

        if ( !response ) {
          showAlert.error( "Erreur lors de la création de l'entraînement." );
          return { success: false };
        }

        addTrainingStore( response );

        router.replace( `/week/${weekId}/page` );

        return { success: true, data: response };
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
 * Mise à jour d'un entraînement et de ses séries
 */
  const handleUpdate = useCallback(
    async ( trainingId: string, { name, duration, days, note }: UpdateTrainingInput, series: SeriesInput[] ) => {
      if ( !user ) {
        showAlert.error( "Utilisateur non connecté" );
        return { success: false };
      }

      if ( isSubmitting ) return { success: false };

      try {
        setIsSubmitting( true );

        await updateTrainingWithSeries( user, trainingId, { name, duration, days, note }, series );

        const allTrainings = await getUserTrainings();
        const updatedTraining = allTrainings.find( ( t ) => t.$id === trainingId );
        if ( updatedTraining ) updateTrainingStore( trainingId, updatedTraining );

        router.dismissTo( `/training/${trainingId}/page` );

        return { success: true };
      } catch ( error ) {
        showAlert.error( error instanceof Error ? error.message : "Une erreur est survenue." );
        return { success: false };
      } finally {
        setIsSubmitting( false );
      }
    },
    [ isSubmitting, user, updateTrainingStore ]
  );

  const handleRename = useCallback( async ( { trainingId, newName }: RenameTrainingInput ) => {
    if ( !user ) {
      showAlert.error( "Utilisateur non connecté" );
      return { success: false };
    }

    if ( isSubmitting ) return { success: false };

    setIsSubmitting( true );

    try {
      const response = await updateTraining( trainingId, { name: newName } );

      if ( !response ) {
        showAlert.error( "Erreur lors de la création de l'entraînement." );
        return { success: false };
      }

      const allTrainings = await getUserTrainings();
      const updatedTraining = allTrainings.find( ( t ) => t.$id === trainingId );

      if ( updatedTraining ) {
        updateTrainingStore( trainingId, updatedTraining );
      }

      return { success: true };
    } catch ( error ) {
      showAlert.error(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
      return { success: false };
    } finally {
      setIsSubmitting( false );
    }
  }, [ user, isSubmitting, updateTrainingStore ] );

  const handleDelete = useCallback(
    async ( { trainingId, weekId }: { trainingId: string; weekId: string } ) => {
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
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de la suppression.";

        showAlert.error( errorMessage );
        return { success: false, error: errorMessage };
      } finally {
        setIsDeleting( false );
      }
    },
    [ user, isDeleting, deleteTrainingStore ]
  );

  return { handleCreate, handleUpdate, handleRename, handleDelete, isSubmitting, isDeleting };
}