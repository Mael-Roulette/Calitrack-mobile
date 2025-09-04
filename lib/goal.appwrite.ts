import { MAX_GOALS } from "@/constants/value";
import { createGoalParams, updatedGoalParams } from "@/types";
import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import { getTypeIdByName } from "./type.appwrite";
import { getCurrentUser } from "./user.appwrite";

/**
 * Permet de créer un nouvel objectif
 * @param param0 - title, type, progress, total
 * @returns {Promise<{goal: Document, message: {title: string, body: string}}>} - L'objectif créé et un message de succès
 * @throws {Error} - Si l'objectif n'a pas pu être créé
 */
export const createGoal = async ({
	title,
	type,
	progress,
	total,
}: createGoalParams) => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) throw Error;

		const existingGoals = await getGoalsFromUser();
		const progressGoals = existingGoals.filter(
			(goal) => goal.state === "in-progress"
		);

		if (progressGoals.length >= MAX_GOALS) {
			const message = {
				title: "Nombre maximum d'objectifs atteint",
				body: "Vous ne pouvez pas avoir plus de 4 objectifs en cours.",
			};

			return message;
		}

		const typeId = await getTypeIdByName(type);

		const goal = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.goalCollectionId,
			ID.unique(),
			{
				createdAt: new Date().toISOString(),
				user: currentUser.$id,
				title,
				type: typeId,
				progress: progress || 0,
				total,
				state: "in-progress",
				progressHistory: JSON.stringify([progress || 0]),
			}
		);

		const message = {
			title: "Nouvel objectif créé",
			body: `Votre objectif "${title}" a été créé avec succès.`,
		};

		return { goal, message };
	} catch (e) {
		throw new Error(e as string);
	}
};

/**
 * Permet de récupérer les objectifs de l'utilisateur actuellement connecté
 * @returns {Promise<Document[]>} - Liste des objectifs de l'utilisateur
 * @throws {Error} - Si les objectifs n'ont pas pu être récupérés
 */
export const getGoalsFromUser = async () => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) throw Error;

		const goals = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.goalCollectionId,
			[Query.equal("user", currentUser.$id)]
		);

		return goals.documents;
	} catch (e) {
		throw new Error(e as string);
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
	id: string,
	{ progress, updateDate }: updatedGoalParams
) => {
	try {
		const currentGoal = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.goalCollectionId,
			id
		);

		const newState = progress >= currentGoal.total ? "finish" : "in-progress";

		const progressHistoryArray = JSON.parse(currentGoal.progressHistory);
		progressHistoryArray.push(progress);

		await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.goalCollectionId,
			id,
			{
				progress,
				progressHistory: JSON.stringify(progressHistoryArray),
				state: newState,
				updateAt: updateDate,
			}
		);
	} catch (e) {
		throw new Error(e as string);
	}
};
