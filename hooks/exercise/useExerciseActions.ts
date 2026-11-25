import { createCustomExercise, deleteCustomExercise, updateCustomExercise, updateCustomExerciseImage } from "@/lib/exercise.appwrite";
import { useAuthStore, useExercicesStore } from "@/store";
import { CreateExercise, Exercise, UpdateExercise } from "@/types";
import { showAlert } from "@/utils/alert";
import { router } from "expo-router";
import { useCallback, useState } from "react";

export function useExerciseActions () {
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );
  const [ isUpdating, setIsUpdating ] = useState<boolean>( false );
  const [ isUpdatingImage, setIsUpdatingImage ] = useState<boolean>( false );
  const [ isDeleting, setIsDeleting ] = useState<boolean>( false );
  const { addExercise, updateExercise, removeExercise } = useExercicesStore();
  const { user } = useAuthStore();

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
    }: CreateExercise ) => {
      if ( !user ) {
        showAlert.error( "Utilisateur non connecté" );
        return { success: false };
      }

      if ( isSubmitting ) return { success: false };

      try {
        setIsSubmitting( true );

        const newExercise = await createCustomExercise( user, {
          name,
          description,
          type,
          difficulty,
          format,
          image
        } );

        addExercise( newExercise );

        router.replace( "/exercises" );

        return { success: true };
      } catch ( error ) {
        showAlert.error(
          error instanceof Error ? error.message : "Une erreur est survenue."
        );
        return { success: false };
      } finally {
        setIsSubmitting( false );
      }
    }, [ addExercise, isSubmitting, user ] );

  /**
 * Action pour modifier un exercice personnalisé
 */
  const handleUpdate = useCallback( async ( { $id, ...data }: UpdateExercise ) => {
    if ( !user ) {
      showAlert.error( "Utilisateur non connecté" );
      return { success: false };
    }

    if ( isUpdating ) return { success: false };

    try {
      setIsUpdating( true );

      await updateCustomExercise( { $id, ...data } );

      updateExercise( $id, data );
      router.replace( "/exercises" );

      return { success: true };
    } catch ( error ) {
      showAlert.error(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
      return { success: false };
    } finally {
      setIsUpdating( false );
    }
  }, [ isUpdating, updateExercise, user ] );

  /**
   * Action pour supprimer un exercice personnalisé
   */
  const handleDelete = useCallback( async ( $id: Exercise["$id"] ) => {
    if ( !user ) {
      showAlert.error( "Utilisateur non connecté" );
      return { success: false, error: "Utilisateur non connecté" };
    }

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
  }, [ isDeleting, removeExercise, user ] );

  /**
   * Action pour modifier l'image d'un exercice personnalisé
   */
  const handleUpdateImage = useCallback(
    async ( $id: string, imageUri: string ) => {
      if ( isUpdatingImage ) return { success: false };

      try {
        setIsUpdatingImage( true );

        await updateCustomExerciseImage( { $id, imageUri } );
        updateExercise( $id, { image: imageUri } );

        return { success: true };
      } catch ( error ) {
        showAlert.error(
          error instanceof Error ? error.message : "Une erreur est survenue."
        );
        return { success: false };
      } finally {
        setIsUpdatingImage( false );
      }
    },
    [ isUpdatingImage, updateExercise ]
  );

  return {
    handleCreate,
    handleUpdate,
    handleUpdateImage,
    handleDelete,
    isSubmitting,
    isUpdating,
    isUpdatingImage,
    isDeleting
  };
}