import { MAX_TRAININGS } from "@/constants/value";
import { Exercise, Training, createTrainingParams, updateTrainingParams } from "@/types";
import { SeriesParams } from "@/types/series";
import {
	ID,
	Models,
	Query
} from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";
import { getSeriesById } from "./series.appwrite";
import { getCurrentUser } from "./user.appwrite";

/**
 * Permet de créer un nouvel entraînement
 * @param param0 - name, days, duration, exercises
 * @returns {Promise<{training: Models.Row, message: {title: string, body: string}}>} - L'entraînement créé et un message de succès
 * @throws {Error} - Si l'entraînement n'a pas pu être créé
 */
export const createTraining = async ( {
	name,
	days,
	duration,
	series,
}: createTrainingParams ): Promise<{ training?: Models.Row; message: { title: string; body: string; }; }> => {
	try {
		const currentUser = await getCurrentUser();
		if ( !currentUser ) throw Error;

		const existingTrainings = await getTrainingsFromUser();

		if ( existingTrainings.length >= MAX_TRAININGS ) {
			const message = {
				title: "Nombre maximum d'entraînements atteint",
				body: "Vous ne pouvez pas ajouter plus de 10 entraînements.",
			};
			return { message };
		}

		const training = await tablesDB.createRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.trainingCollectionId,
			rowId: ID.unique(),
			data: {
				$createdAt: new Date().toISOString(),
				user: currentUser.$id,
				name,
				days,
				duration,
				series: series || [],
			}
		} );

		const message = {
			title: "Nouveau training créé",
			body: `Votre entraînement "${name}" a été créé avec succès.`,
		};

		return { training, message };
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de récupérer les entraînements de l'utilisateur actuellement connecté
 * @returns {Promise<Training[]>} - Liste des entraînements de l'utilisateur
 * @throws {Error} - Si les entraînements n'ont pas pu être récupérés
 */
export const getTrainingsFromUser = async (): Promise<Training[]> => {
	try {
		const currentUser = await getCurrentUser();
		if ( !currentUser ) throw Error;
		const trainings = await tablesDB.listRows( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.trainingCollectionId,
			queries: [ Query.equal( "user", currentUser.$id ) ]
		} );

		return trainings.rows.map( ( doc ) => ( {
			$id: doc.$id,
			user: doc.user as string,
			name: doc.name as string,
			days: doc.days as string[] | undefined,
			duration: doc.duration as number,
			exercise: doc.exercise as Exercise[] | undefined,
			series: doc.series as SeriesParams[] | undefined,
		} ) );
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de récupérer les entraînements de l'utilisateur avec un jour spécifique
 * @param day - Le jour pour lequel récupérer les entraînements
 * @returns {Promise<Models.Row[]>} - Liste des entraînements de l'utilisateur pour le jour spécifié
 * @throws {Error} - Si les entraînements n'ont pas pu être récupérés
 */
export const getTrainingFromUserByDay = async ( day: string ): Promise<Models.Row[]> => {
	try {
		const currentUser = await getCurrentUser();
		if ( !currentUser ) throw Error;

		const trainings = await tablesDB.listRows( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.trainingCollectionId,
			queries: [ Query.equal( "user", currentUser.$id ), Query.equal( "days", day ) ]
		} );

		return trainings.rows;
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de récupérer un entraînement par son ID
 * @param id - ID de l'entraînement à récupérer
 * @returns {Promise<Models.Document>} - L'entraînement récupéré
 * @throws {Error} - Si l'entraînement n'a pas pu être récupéré
 */
export const getTrainingById = async ( id: string ): Promise<Models.Row> => {
	try {
		const training = await tablesDB.getRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.trainingCollectionId,
			rowId: id
		} );

		if ( !training.series ) return training;

		const seriesIds = training.series;
		const series = seriesIds.map( async (serie: string) => {
			await getSeriesById( serie );
		})

		console.log(series)

		return training;
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de mettre à jour un entraînement existant
 * @param id - ID de l'entraînement à modifier
 * @param param1 - name, days, duration, exercises
 * @returns {Promise<Models.Row>} - L'entraînement mis à jour
 * @throws {Error} - Si la mise à jour a échoué
 */
export const updateTraining = async ( {
	id,
	name,
	days,
	duration,
	series,
}: updateTrainingParams ): Promise<Models.Row> => {
	try {
		const updateData: any = {};

		if ( name !== undefined ) updateData.name = name;
		if ( days !== undefined ) updateData.days = days;
		if ( duration !== undefined ) updateData.duration = duration;
		if ( series !== undefined ) updateData.series = series;

		const training = await tablesDB.updateRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.trainingCollectionId,
			rowId: id,
			data: updateData
		} );

		return training;
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet d'incrémenter le nombre d'entraînements terminés pour un utilisateur
 * @param userId - id de l'utilisateur
 */
export const incrementUserTrainings = async ( userId: string ) => {
	try {
		const userDoc = await tablesDB.getRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.userCollectionId,
			rowId: userId
		} );

		const currentCompletedTrainings = userDoc.completedTrainings || 0;

		await tablesDB.updateRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.userCollectionId,
			rowId: userId,
			data: {
				completedTrainings: currentCompletedTrainings + 1,
			}
		} );
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de supprimer un entraînement en fonction de son id
 * @param id - id de l'entraînement
 */
export const deleteTraining = async ( id: string ) => {
	try {
		await tablesDB.deleteRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.trainingCollectionId,
			rowId: id
		} );
	} catch ( e ) {
		throw new Error( e as string );
	}
};