import { appwriteConfig, databases } from "./appwrite";
import { Models } from "react-native-appwrite";

/**
 * Permet de récupérer tous les exercices disponibles
 * @returns {Promise<Models.DefaultDocument[]>} - Liste des exercices disponibles
 * @throws {Error} - Si les exercices n'ont pas pu être récupérés
 */
export const getAllExercises = async (): Promise<Models.DefaultDocument[]> => {
	try {
		const exercises = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.exerciseCollectionId
		);

		return exercises.documents;
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de récupérer un exercice par son ID
 * @param id - id de l'exercice à récupérer
 * @returns {Promise<Models.DefaultDocument>} - L'exercice correspondant à l'id
 * @throws {Error} - Si l'exercice n'a pas pu être récupéré
 */
export const getExericseById = async ( id: string ): Promise<Models.DefaultDocument> => {
	try {
		const exercise = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.exerciseCollectionId,
			id
		);

		return exercise;
	} catch ( e ) {
		throw new Error( e as string );
	}
};


