import { createCustomExercise, updateCustomExercise } from "@/lib/exercise.appwrite";
import { useExercicesStore } from "@/store";
import { Exercise } from "@/types";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export function useExerciseActions () {
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );
  const [ isUpdating, setIsUpdating ] = useState<boolean>( false );
  const [ isDeleting, setIsDeleting ] = useState<boolean>( false );
  const { addExercise, updateExercise } = useExercicesStore();

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

  /**
   * Action pour modifier un exercice personnalisé
   */
  const handleUpdate = useCallback( async ( {
    $id,
    name,
    description,
    type,
    difficulty,
    format,
    image
  }: Exercise ) => {
    if ( isUpdating ) return;

    setIsUpdating( true );

    try {
      const response = await updateCustomExercise( {
        $id,
        name,
        description,
        type,
        difficulty,
        format,
        image
      } );

      if ( !response ) {
        showAlert.error(
          "Erreur lors de la modification de l'exercice",
          () => router.push( "/exercises" )
        );
        return;
      }

      updateExercise( $id, { name, description, type, difficulty, format, image } );
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
  }, [ isUpdating, updateExercise ] );

  return {
    handleCreate,
    handleUpdate,
    isSubmitting,
    isUpdating
  };
}