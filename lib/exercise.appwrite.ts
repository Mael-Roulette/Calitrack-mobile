import { Exercise } from "@/types";
import { ID, Models, Permission, Query, Role } from "react-native-appwrite";
import { account, appwriteConfig, databases } from "./appwrite";
import { MAX_CUSTOM_EXERCISES } from "@/constants/value";

/**
 * Permet de récupérer tous les exercices disponibles (généraux + personnalisés de l'utilisateur)
 * @param userId - ID de l'utilisateur (optionnel) pour récupérer aussi ses exercices personnalisés
 * @returns {Promise<Models.Document[]>} - Liste des exercices disponibles
 * @throws {Error} - Si les exercices n'ont pas pu être récupérés
 */
export const getAllExercises = async (): Promise<Models.Document[]> => {
	const currentAccount = await account.get();
	if ( !currentAccount ) throw Error;

	try {
		// Récupérer les exercices généraux (isCustom = false ou null)
		const generalExercises = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.exerciseCollectionId,
			[
				Query.or( [
					Query.equal( 'isCustom', false ),
					Query.isNull( 'isCustom' )
				] )
			]
		);

		let customExercises: Models.Document[] = [];

		try {
			const customResponse = await databases.listDocuments(
				appwriteConfig.databaseId,
				appwriteConfig.exerciseCollectionId,
				[
					Query.equal( 'isCustom', true ),
					Permission.read( Role.user( currentAccount.$id ) ),
				]
			);
			customExercises = customResponse.documents;
		} catch {
			customExercises = [];
		}


		// Combiner les deux listes
		return [ ...generalExercises.documents, ...customExercises ];
	} catch ( error ) {
		console.error( "Erreur lors de la récupération des exercices:", error );
		throw new Error(
			error instanceof Error ? error.message : "Impossible de récupérer les exercices"
		);
	}
};

/**
 * Permet de récupérer uniquement les exercices généraux
 * @returns {Promise<Models.Document[]>} - Liste des exercices généraux
 * @throws {Error} - Si les exercices n'ont pas pu être récupérés
 */
export const getGeneralExercises = async (): Promise<Models.Document[]> => {
	try {
		const response = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.exerciseCollectionId,
			[
				Query.or( [
					Query.equal( 'isCustom', false ),
					Query.isNull( 'isCustom' )
				] )
			]
		);
		return response.documents;
	} catch ( error ) {
		console.error( "Erreur lors de la récupération des exercices généraux:", error );
		throw new Error(
			error instanceof Error ? error.message : "Impossible de récupérer les exercices généraux"
		);
	}
};

/**
 * Permet de récupérer uniquement les exercices personnalisés de l'utilisateur
 * @param userId - ID de l'utilisateur
 * @returns {Promise<Models.Document[]>} - Liste des exercices personnalisés
 * @throws {Error} - Si les exercices n'ont pas pu être récupérés
 */
export const getCustomExercises = async ( userId: string ): Promise<Models.Document[]> => {
	try {
		const response = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.exerciseCollectionId,
			[
				Query.equal( 'isCustom', true )
			]
		);
		return response.documents;
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
 * @returns {Promise<Models.Document>} - L'exercice correspondant à l'ID
 * @throws {Error} - Si l'exercice n'a pas pu être récupéré
 */
export const getExerciseById = async ( id: string ): Promise<Models.Document> => {
	try {
		const exercise = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.exerciseCollectionId,
			id
		);
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
export const createCustomExercise = async ( {
	name,
	description,
	type,
	difficulty,
	format,
	image
}: Omit<Exercise, "$id"> ) => {
	try {
		const currentAccount = await account.get();
		if ( !currentAccount ) throw Error;

		const existingCustomExercises = await getCustomExercises( currentAccount.$id );

		if ( existingCustomExercises.length >= MAX_CUSTOM_EXERCISES ) {
			return;
		}

		const customExercise = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.exerciseCollectionId,
			ID.unique(),
			{
				name,
				description,
				type,
				difficulty,
				format,
				image,
				isCustom: true
			},
			[
				Permission.read( Role.user( currentAccount.$id ) ),
				Permission.update( Role.user( currentAccount.$id ) ),
				Permission.delete( Role.user( currentAccount.$id ) )
			]
		);

		return customExercise;
	} catch ( e ) {
		throw new Error( e as string );
	}
}

/**
 * Permet de modifier un exercice personnalisé
 * @returns l'exercice personnalisé modifié
 */
export const updateCustomExercise = async ( {
	$id,
	name,
	description,
	type,
	difficulty,
	format,
	image
}: Exercise ) => {
	try {
		const currentAccount = await account.get();
		if ( !currentAccount ) throw Error;

		const customExercise = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.exerciseCollectionId,
			$id,
			{
				name,
				description,
				type,
				difficulty,
				format,
				image,
			}
		);

		return customExercise;
	} catch ( e ) {
		throw new Error( e as string );
	}
}

/**
 * Permet de supprimer un exercice personnalisé
 * @param id id de l'exercice à supprimer
 */
export const deleteCustomExercise = async ( id: string ) => {
	try {
		await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.exerciseCollectionId,
			id
		);
		
	} catch ( e ) {
		throw new Error( e as string );
	}
}