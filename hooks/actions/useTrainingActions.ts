import { appwriteConfig, tablesDB } from "@/lib/appwrite";
import { createTraining, deleteTraining, getUserTrainings, updateTraining } from "@/lib/training.appwrite";
import { useAuthStore } from "@/store";
import useTrainingsStore from "@/store/training.store";
import { CreateSeriesInput, Training } from "@/types";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ID, Permission, Role } from "react-native-appwrite";

type CreateTrainingInput = {
  weekId: string;
  name: string;
  duration: number;
  days: string[];
  note?: string;
  series: CreateSeriesInput[];
};

type UpdateTrainingInput = {
  trainingId: string;
  name: string;
  duration: number;
  days: string[];
  note?: string;
  series: CreateSeriesInput[];
};

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
   * Mise à jour d'un entraînement existant :
   * 1. Met à jour les infos générales (nom, durée, jours, note)
   * 2. Supprime toutes les anciennes séries
   * 3. Recrée les nouvelles séries
   */
  const handleUpdate = useCallback(
    async ( { trainingId, name, duration, days, note, series }: UpdateTrainingInput ) => {
      if ( !user ) {
        showAlert.error( "Utilisateur non connecté" );
        return { success: false };
      }

      if ( isSubmitting ) return { success: false };

      setIsSubmitting( true );

      try {
        // 1. Mise à jour des infos générales
        const updateResponse = await updateTraining( trainingId, { name, duration, days, note } );

        if ( !updateResponse?.updatedTraining ) {
          showAlert.error(
            updateResponse?.message?.body ?? "Erreur lors de la modification de l'entraînement."
          );
          return { success: false };
        }

        // 2. Supprimer les anciennes séries
        const allSeries = await tablesDB.listRows( {
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.seriesCollectionId,
        } );

        const oldSeries = allSeries.rows.filter( ( s ) => s.training === trainingId );
        await Promise.all(
          oldSeries.map( ( s ) =>
            tablesDB.deleteRow( {
              databaseId: appwriteConfig.databaseId,
              tableId: appwriteConfig.seriesCollectionId,
              rowId: s.$id,
            } )
          )
        );

        // 3. Recréer les nouvelles séries
        await Promise.all(
          series.map( ( s ) =>
            tablesDB.createRow( {
              databaseId: appwriteConfig.databaseId,
              tableId: appwriteConfig.seriesCollectionId,
              rowId: ID.unique(),
              data: {
                exercise: s.exerciseId,
                sets: s.sets,
                targetValue: s.targetValue,
                rpe: s.rpe,
                weight: s.weight,
                restTime: s.restTime,
                order: s.order,
                training: trainingId,
              },
              permissions: [
                Permission.read( Role.user( user.accountId ) ),
                Permission.update( Role.user( user.accountId ) ),
                Permission.delete( Role.user( user.accountId ) ),
              ],
            } )
          )
        );

        // 4. Refetch pour récupérer les séries enrichies à jour
        const allTrainings = await getUserTrainings() as unknown as Training[];
        const updatedTraining = allTrainings.find( ( t ) => t.$id === trainingId );

        if ( updatedTraining ) {
          updateTrainingStore( trainingId, updatedTraining );
        }

        const weekId = updatedTraining?.week;
        router.replace( `/week/${weekId}/page` );

        return { success: true };
      } catch ( error ) {
        showAlert.error(
          error instanceof Error ? error.message : "Une erreur est survenue."
        );
        return { success: false };
      } finally {
        setIsSubmitting( false );
      }
    },
    [ isSubmitting, user, updateTrainingStore ]
  );

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

  return { handleCreate, handleUpdate, handleDelete, isSubmitting, isDeleting };
}