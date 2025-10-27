import { MAX_GOALS } from "@/constants/value";
import { CreateGoalParams, UpdatedGoalParams } from "@/types";
import { ID, Models, Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import { getCurrentUser } from "./user.appwrite";

/**
 * Permet de créer un nouvel objectif
 * @param param0 - title, progress, total
 * @returns {Promise<{goal: Models.DefaultDocument, message: {title: string, body: string}}>} - L'objectif créé et un message de succès
 * @throws {Error} - Si l'objectif n'a pas pu être créé
 */
export const createGoal = async ( {
	title,
	progress,
	total,
}: CreateGoalParams ): Promise<{ goal?: Models.DefaultDocument; message: { title: string; body: string; }; }> => {
	try {
		const currentUser = await getCurrentUser();
		if ( !currentUser ) throw Error;

		// objectifs existants
		const existingGoals = await getGoalsFromUser();

		// Filtrer les objectifs en cours
		const progressGoals = existingGoals.filter(
			( goal ) => goal.state === "in-progress"
		);

		// Vérification du nombre d'objectifs déjà créé
		if ( progressGoals.length >= MAX_GOALS ) {
			const message = {
				title: "Nombre maximum d'objectifs atteint",
				body: "Vous ne pouvez pas avoir plus de 4 objectifs en cours.",
			};

			return { message };
		}

		// Création de l'objectif
		const goal = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.goalCollectionId,
			ID.unique(),
			{
				createdAt: new Date().toISOString(),
				user: currentUser.$id,
				title,
				progress,
				total,
				progressHistory: JSON.stringify( [ progress || 0 ] ),
			}
		);

		const message = {
			title: "Nouvel objectif créé",
			body: `Votre objectif "${title}" a été créé avec succès.`,
		};

		return { goal, message };
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de récupérer les objectifs de l'utilisateur actuellement connecté
 * @returns {Promise<Models.DefaultDocument[]>} - Liste des objectifs de l'utilisateur
 * @throws {Error} - Si les objectifs n'ont pas pu être récupérés
 */
export const getGoalsFromUser = async (): Promise<Models.DefaultDocument[]> => {
	try {
		// Récupération de l'utilisateur connecté
		const currentUser = await getCurrentUser();
		if ( !currentUser ) throw Error;

		// Récupération des objectifs de l'utilisateur connecté
		const goals = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.goalCollectionId,
			[ Query.equal( "user", currentUser.$id ) ]
		);

		return goals.documents;
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de modifier un objectif existant
 * @param id - ID de l'objectif à modifier
 * @param param1 - progress, updateDate
 * @returns {Promise<void>} - Si la mise à jour a réussi
 * @throws {Error} - Si la mise à jour a échoué
 */
export const updateGoal = async (
	{ $id, progress, updateDate }: UpdatedGoalParams
): Promise<void> => {
	try {
		// récupérer l'objectif à mettre à jour
		const currentGoal = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.goalCollectionId,
			$id
		);

		// On vérifie que l'objectif est validé ou non
		const newState = progress >= currentGoal.total ? "finished" : "in-progress";

		// On met à jour la progression de l'utilisateur
		const progressHistoryArray = JSON.parse( currentGoal.progressHistory );
		progressHistoryArray.push( progress );

		// on met à jour le document
		await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.goalCollectionId,
			$id,
			{
				progress,
				progressHistory: JSON.stringify( progressHistoryArray ),
				state: newState,
				updateAt: updateDate,
			}
		);
	} catch ( e ) {
		throw new Error( e as string );
	}
};
