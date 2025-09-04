import { MAX_TRAININGS } from "@/constants/value";
import { createTrainingParams, updateTrainingParams } from "@/types";
import {
	ID,
	Query
} from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import { getCurrentUser } from "./user.appwrite";

/**
 * Permet de créer un nouvel entrainement
 * @param param0 - name, days, duration
 * @returns {Promise<{training: Document, message: {title: string, body: string}}>} - L'entrainement créé et un message de succès
 * @throws {Error} - Si l'entrainement n'a pas pu être créé
 */
export const createTraining = async ({
	name,
	days,
	duration,
	exercises,
}: createTrainingParams) => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) throw Error;

		const existingTrainings = await getTrainingsFromUser();

		if (existingTrainings.length >= MAX_TRAININGS) {
			const message = {
				title: "Nombre maximum d'entrainements atteint",
				body: "Vous ne pouvez pas ajouter plus de 10 entrainements.",
			};
			return message;
		}

		let exercisesTab: any = [];
		if (exercises && exercises.length !== 0) {
			exercisesTab = exercises;
		}

		const training = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.trainingCollectionId,
			ID.unique(),
			{
				user: currentUser.$id,
				name: name,
				days: days,
				duration: duration,
				exercise: exercisesTab,
			}
		);

		const message = {
			title: "Nouveau training créé",
			body: `Votre entrainement "${name}" a été créé avec succès.`,
		};

		return { training, message };
	} catch (e) {
		throw new Error(e as string);
	}
};

/**
 * Permet de récupérer les entrainements de l'utilisateur actuellement connecté
 * @returns {Promise<Document[]>} - Liste des entrainements de l'utilisateur
 * @throws {Error} - Si les entrainements n'ont pas pu être récupérés
 */
export const getTrainingsFromUser = async () => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) throw Error;

		const trainings = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.trainingCollectionId,
			[Query.equal("user", currentUser.$id)]
		);

		return trainings.documents;
	} catch (e) {
		throw new Error(e as string);
	}
};

/**
 * Permet de récupérer les entrainements de l'utilisateur avec un jour spécifique
 * @param day - Le jour pour lequel récupérer les entrainements
 * @returns {Promise<Document[]>} - Liste des entrainements de l'utilisateur pour le jour spécifié
 * @throws {Error} - Si les entrainements n'ont pas pu être récupérés
 */
export const getTrainingFromUserByDay = async (day: string) => {
	try {
		const currentUser = await getCurrentUser();
		if (!currentUser) throw Error;

		const trainings = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.trainingCollectionId,
			[Query.equal("user", currentUser.$id), Query.equal("days", day)]
		);

		return trainings.documents;
	} catch (e) {
		throw new Error(e as string);
	}
};

/**
 * Permet de récupérer un entrainement par son ID
 * @param id - ID de l'entrainement à récupérer
 * @returns {Promise<Document>} - L'entrainement récupéré
 * @throws {Error} - Si l'entrainement n'a pas pu être récupéré
 */
export const getTrainingById = async (id: string) => {
	try {
		const training = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.trainingCollectionId,
			id
		);

		return training;
	} catch (e) {
		throw new Error(e as string);
	}
};

/**
 * Permet de mettre à jour un entrainement existant
 * @param id - ID de l'entrainement à modifier
 * @param param1 - name, days, duration
 * @returns {Promise<void>} - Si la mise à jour a réussi
 * @throws {Error} - Si la mise à jour a échoué
 */
export const updateTraining = async ({
	id,
	name,
	days,
	duration,
	exercises,
}: updateTrainingParams) => {
	try {
		await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.trainingCollectionId,
			id,
			{
				name: name,
				days: days,
				duration: duration,
				exercise: exercises,
			}
		);
	} catch (e) {
		throw new Error(e as string);
	}
};

/**
 * Permet d'incrémenter le nombre d'entrainements terminés pour un utilisateur
 * @param userId - id de l'utilisateur
 */
export const incrementUserTrainings = async (userId: string) => {
	try {
		const userDoc = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			userId
		);

		const currentCompletedTrainings = userDoc.completedTrainings || 0;

		await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			userId,
			{
				completedTrainings: currentCompletedTrainings + 1,
			}
		);
	} catch (e) {
		throw new Error(e as string);
	}
};

/**
 * Permet de supprimer un entrainement en fonction de son id
 * @param id - id de l'entrainement
 */
export const deleteTraining = async (id: string) => {
	try {
		await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.trainingCollectionId,
			id
		);
	} catch (e) {
		throw new Error(e as string);
	}
};
