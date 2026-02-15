import { createCustomExercise } from "@/lib/exercise.appwrite";
import { useExercicesStore } from "@/store";
import { Exercise } from "@/types";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export function useExerciseActions () {
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );
  const [ isUpdating, setIsUpdating ] = useState<boolean>( false );
  const [ isDeleting, setIsDeleting ] = useState<boolean>( false );
  const { addExercise } = useExercicesStore();

  /**
   * Action pour créer un exercice personnalisé
   */
  const handleCreate = useCallback(
    async ( {
      name,
      description,
      type,
      difficulty,
      format,
      image
    }: Omit<Exercise, "$id"> ) => {
      if ( isSubmitting ) return;

      setIsSubmitting( true );

      try {
        const response = await createCustomExercise( {
          name,
          description,
          type,
          difficulty,
          format,
          image
        } );

        if ( !response ) {
          showAlert.error(
            "Erreur lors de la création de l'exercice",
            () => router.push( "/exercises" )
          );
          return;
        }

        addExercise( response as unknown as Exercise );
      } catch ( error ) {
        console.log( error );
        showAlert.error(
          error instanceof Error
            ? error.message
            : "Une erreur est survenue."
        );
      } finally {
        router.push( "/exercises" );
      }
    }, [ addExercise, isSubmitting ] );

  return {
    handleCreate,
    isSubmitting
  };
}