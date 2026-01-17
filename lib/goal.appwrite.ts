import { MAX_GOALS } from "@/constants/value";
import { CreateGoalParams, Goal, UpdatedGoalParams } from "@/types";
import { ID, Models, Query } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";
import { getCurrentUser } from "./user.appwrite";
import { getExerciseById } from "./exercise.appwrite";

/**
 * Permet de créer un nouvel objectif
 * @param param0 - exercise, progress, total
 * @returns {Promise<{goal: Models.Row, message: {title: string, body: string}}>} - L'objectif créé et un message de succès
 * @throws {Error} - Si l'objectif n'a pas pu être créé
 */
export const createGoal = async ( {
	exercise,
	progress,
	total,
}: CreateGoalParams ): Promise<{ goal?: Models.Row; message: { title: string; body: string; }; }> => {
	try {
		const currentUser = await getCurrentUser();
		if ( !currentUser ) throw Error;

		// objectifs existants
		const existingGoals = await getGoalsFromUser() as unknown as Goal[];

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
		const goal = await tablesDB.createRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.goalCollectionId,
			rowId: ID.unique(),
			data: {
				$createdAt: new Date().toISOString(),
				user: currentUser.$id,
				exercise,
				progress,
				total,
				progressHistory: JSON.stringify( [ progress || 0 ] ),
			}
		} );

		const message = {
			title: "Nouvel objectif créé",
			body: `Votre objectif =a été créé avec succès.`,
		};

		return { goal, message };
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de récupérer les objectifs de l'utilisateur actuellement connecté
 * @returns {Promise<Models.Row[]>} - Liste des objectifs de l'utilisateur
 * @throws {Error} - Si les objectifs n'ont pas pu être récupérés
 */
export const getGoalsFromUser = async (): Promise<Models.Row[]> => {
	try {
		const currentUser = await getCurrentUser();
		if ( !currentUser ) throw new Error( "Utilisateur non connecté" );

		// Récupérer tous les objectifs
		const goalsResponse = await tablesDB.listRows( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.goalCollectionId,
			queries: [ Query.equal( "user", currentUser.$id ) ]
		} );

		const goals = goalsResponse.rows;

		// Récupérer tous les exercices liés en parallèle
		const goalsWithExercises = await Promise.all(
			goals.map( async goal => {
				if ( !goal.exercise ) return goal; // si pas d'exercice lié
				const exerciseId = typeof goal.exercise === "string" ? goal.exercise : goal.exercise.$id;
				const exercise = await getExerciseById( exerciseId );
				return {
					...goal,
					exercise
				};
			} )
		);

		return goalsWithExercises;
	} catch ( e ) {
		throw new Error( e instanceof Error ? e.message : "Impossible de récupérer les objectifs" );
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
	{ $id, progress }: UpdatedGoalParams
): Promise<void> => {
	try {
		// récupérer l'objectif à mettre à jour
		const currentGoal = await tablesDB.getRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.goalCollectionId,
			rowId: $id
		} );

		// On vérifie que l'objectif est validé ou non
		const newState = progress >= currentGoal.total ? "finish" : "in-progress";

		// On met à jour la progression de l'utilisateur
		const progressHistoryArray = JSON.parse( currentGoal.progressHistory );
		progressHistoryArray.push( progress );

		// on met à jour le document
		await tablesDB.updateRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.goalCollectionId,
			rowId: $id,
			data: {
				progress,
				progressHistory: JSON.stringify( progressHistoryArray ),
				state: newState,
			}
		} );
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de supprimer un objectif
 * @param id id de l'objectif à supprimer
 */
export const deleteGoal = async ( id: string ) => {
	try {
		await tablesDB.deleteRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.goalCollectionId,
			rowId: id
		} );
	} catch ( e ) {
		throw new Error( e as string );
	}
};