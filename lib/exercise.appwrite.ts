import { LIMITS } from "@/constants/value";
import { CreateExercise, Exercise, ExerciseType, UpdateExercise, UpdateExerciseImage, User } from "@/types";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";
import { deleteFile, getFileIdFromUrl } from "./bucket.appwrite";

export const EXERCISES_PAGE_SIZE = 20;

export const getExercisesByType = async ( type: ExerciseType, cursor?: string ): Promise<Exercise[]> => {
  try {
    const queries = [
      Query.equal( "type", type ),
      Query.equal( "isCustom", false ),
      Query.limit( EXERCISES_PAGE_SIZE )
    ];

    if ( cursor ) {
      queries.push( Query.cursorAfter( cursor ) ) ;
    }

    const exercises = await tablesDB.listRows<Exercise>( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.exerciseCollectionId,
      queries,
      total: false
    } );

    return exercises.rows;
  } catch ( error ) {
    console.error( "Erreur lors de la récupération des exercices:", error );
    throw new Error(
      error instanceof Error ? error.message : "Impossible de récupérer les exercices"
    );
  }
};

/**
 * Permet de récupérer uniquement les exercices personnalisés de l'utilisateur
 * @returns {Promise<Exercise[]>} - Liste des exercices personnalisés
 * @throws {Error} - Si les exercices n'ont pas pu être récupérés
 */
export const getCustomExercises = async ( ): Promise<Exercise[]> => {
  try {
    const response = await tablesDB.listRows<Exercise>( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.exerciseCollectionId,
      queries: [
        Query.equal( "isCustom", true )
      ]
    } );
    return response.rows;
  } catch ( error ) {
    console.error( "Erreur lors de la récupération des exercices personnalisés:", error );
    throw new Error(
      error instanceof Error ? error.message : "Impossible de récupérer les exercices personnalisés"
    );
  }
};

/**
 * Permet de récupérer un exercice par son ID
 * @param id - ID de l'exercice à récupérer
 * @returns {Promise<Exercise>} - L'exercice correspondant à l'ID
 * @throws {Error} - Si l'exercice n'a pas pu être récupéré
 */
export const getExerciseById = async ( id: string ): Promise<Exercise> => {
  try {
    const exercise = await tablesDB.getRow<Exercise>( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.exerciseCollectionId,
      rowId: id
    } );
    return exercise;
  } catch ( error ) {
    console.error( "Erreur lors de la récupération de l'exercice:", error );
    throw new Error(
      error instanceof Error ? error.message : "Impossible de récupérer l'exercice"
    );
  }
};

/**
 * Permet de créer un exercice personnalisé pour un seul utilisateur
 * @returns l'exercice personnalisé
 */
export const createCustomExercise = async ( user: User, exerciseProps: CreateExercise ): Promise<Exercise> => {
  try {
    const existingCustomExercises = await getCustomExercises();

    if ( existingCustomExercises.length >= LIMITS.MAX_CUSTOM_EXERCISES ) {
      throw new Error( "Impossible d'ajouter de nouveaux exercices" );
    }

    const customExercise = await tablesDB.createRow<Exercise>( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.exerciseCollectionId,
      rowId: ID.unique(),
      data: { ...exerciseProps, isCustom: true },
      permissions: [
        Permission.read( Role.user( user.accountId ) ),
        Permission.update( Role.user( user.accountId ) ),
        Permission.delete( Role.user( user.accountId ) ),
      ]
    } );

    return customExercise;
  } catch ( e ) {
    throw e instanceof Error ? e : new Error( String( e ) );
  }
};

/**
 * Permet de modifier un exercice personnalisé
 * @returns l'exercice personnalisé modifié
 */
export const updateCustomExercise = async ( { $id, ...data }: UpdateExercise ): Promise<Exercise> => {
  try {
    return await tablesDB.updateRow<Exercise>( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.exerciseCollectionId,
      rowId: $id,
      data,
    } );
  } catch ( e ) {
    throw e instanceof Error ? e : new Error( String( e ) );
  }
};

export const updateCustomExerciseImage = async ( {
  $id,
  imageUri
}: UpdateExerciseImage ): Promise<void> => {
  try {
    await tablesDB.updateRow( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.exerciseCollectionId,
      rowId: $id,
      data: {
        image: imageUri
      }
    } );
  } catch ( e ) {
    throw e instanceof Error ? e : new Error( String( e ) );
  }
};

/**
 * Permet de supprimer un exercice personnalisé
 * @param id id de l'exercice à supprimer
 */
export const deleteCustomExercise = async ( id: string ): Promise<void> => {
  try {
    const exercise = await getExerciseById( id );

    if ( exercise.image ) {
      const imageId = getFileIdFromUrl( exercise.image );

      if ( imageId ) {
        await deleteFile( imageId );
      }
    }

    await tablesDB.deleteRow( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.exerciseCollectionId,
      rowId: id
    } );

  } catch ( e ) {
    throw e instanceof Error ? e : new Error( String( e ) );
  }
};