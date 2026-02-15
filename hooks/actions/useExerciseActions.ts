import { createCustomExercise, deleteCustomExercise, updateCustomExercise } from "@/lib/exercise.appwrite";
import { useExercicesStore } from "@/store";
import { Exercise } from "@/types";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export function useExerciseActions () {
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );
  const [ isUpdating, setIsUpdating ] = useState<boolean>( false );
  const [ isDeleting, setIsDeleting ] = useState<boolean>( false );
  const { addExercise, updateExercise, removeExercise } = useExercicesStore();

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
        setIsSubmitting( false );
        router.replace( "/exercises" );
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
      setIsUpdating( false );
      router.replace( "/exercises" );
    }
  }, [ isUpdating, updateExercise ] );

  /**
   * Action pour supprimer un exercice personnalisé
   */
  const handleDelete = useCallback( async ( $id : Exercise["$id"] ) => {
    if ( isDeleting ) return { success: false, error: "Suppression en cours" };

    return new Promise<{ success: boolean; error?: string }>( ( resolve ) => {
      showAlert.confirm(
        "Suppression",
        "Vous êtes sur le point de supprimer un exercice. Cette action est irréversible, êtes-vous sûr de continuer ?",
        async () => {
          setIsDeleting( true );

          try {
            await deleteCustomExercise( $id );
            removeExercise( $id );

            router.replace( "/exercises" );

            resolve( { success: true } );
          } catch ( error ) {
            console.error( "Erreur suppression exercice:", error );
            const errorMessage =
            error instanceof Error
              ? error.message
              : "Une erreur est survenue lors de la suppression.";

            showAlert.error( errorMessage );
            resolve( { success: false, error: errorMessage } );
          } finally {
            setIsDeleting( false );
          }
        },
        () => {
          resolve( { success: false, error: "Suppression annulée" } );
        }
      );
    } );
  }, [ isDeleting, removeExercise ] );

  return {
    handleCreate,
    handleUpdate,
    handleDelete,
    isSubmitting,
    isUpdating,
    isDeleting
  };
}