import { createTraining } from "@/lib/training.appwrite";
import { useAuthStore } from "@/store";
import { CreateSeriesInput } from "@/types";
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

        showAlert.success( "Entraînement créé avec succès !", () => {
          router.replace( `/week/${weekId}/page` );
        } );

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
    [ isSubmitting, user ]
  );

  return { handleCreate, isSubmitting };
}
