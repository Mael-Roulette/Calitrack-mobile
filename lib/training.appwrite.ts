import { LIMITS } from "@/constants/value";
import { CreateSeriesInput, Series, Training, User } from "@/types";
import { ID, Permission, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";
import { getExerciseById } from "./exercise.appwrite";

const databaseId = appwriteConfig.databaseId;
const trainingTable = appwriteConfig.trainingCollectionId;
const seriesTable = appwriteConfig.seriesCollectionId;

type CreateTrainingInput = {
  name: string;
  duration: number;
  days?: string[];
  note?: string;
  series: CreateSeriesInput[];
};

/**
 * Récupère tous les entraînements avec leurs séries enrichies
 */
export const getUserTrainings = async () => {
  try {
    const [ trainingsResponse, seriesResponse ] = await Promise.all( [
      tablesDB.listRows( { databaseId, tableId: trainingTable } ),
      tablesDB.listRows( { databaseId, tableId: seriesTable } ),
    ] );

    const enrichedSeries = await Promise.all(
      seriesResponse.rows.map( async ( s ) => {
        const exercise = await getExerciseById(
          typeof s.exercise === "string" ? s.exercise : s.exercise.$id
        );
        return { ...s, exercise };
      } )
    ) as unknown as Series[];

    return trainingsResponse.rows.map( ( training ) => ( {
      ...training,
      series: enrichedSeries
        .filter( ( s ) => s.training === training.$id )
        .sort( ( a, b ) => a.order - b.order ),
    } ) ) as unknown as Training[];
  } catch ( error ) {
    console.error( "Erreur lors de la récupération des entraînements:", error );
    throw new Error(
      error instanceof Error ? error.message : "Impossible de récupérer les entraînements"
    );
  }
};

/**
 * Récupère les entraînements d'une semaine donnée
 */
export const getTrainingsByWeek = async ( weekId: string ) => {
  try {
    const allTrainings = await getUserTrainings() as unknown as Training[];
    return allTrainings.filter( ( t ) => t.week === weekId );
  } catch ( error ) {
    console.error( "Erreur lors de la récupération des entraînements de la semaine:", error );
    throw new Error(
      error instanceof Error ? error.message : "Impossible de récupérer les entraînements"
    );
  }
};

/**
 * Crée un entraînement et toutes ses séries pour une semaine donnée.
 */
export const createTraining = async (
  user: User,
  weekId: string,
  { name, duration, days, note, series }: CreateTrainingInput
) => {
  const existingTrainings = await getTrainingsByWeek( weekId );
  if ( existingTrainings.length >= LIMITS.MAX_TRAININGS ) {
    return {
      message: {
        title: "Limite atteinte",
        body: `Maximum ${LIMITS.MAX_TRAININGS} entraînements par semaine.`,
      },
    };
  }

  try {
    const newTraining = await tablesDB.createRow( {
      databaseId,
      tableId: trainingTable,
      rowId: ID.unique(),
      data: {
        name,
        duration,
        days: days ?? [],
        note: note ?? null,
        week: weekId,
      },
      permissions: [
        Permission.read( Role.user( user.accountId ) ),
        Permission.update( Role.user( user.accountId ) ),
        Permission.delete( Role.user( user.accountId ) ),
      ],
    } );

    const createdSeries = await Promise.all(
      series.map( ( s ) =>
        tablesDB.createRow( {
          databaseId,
          tableId: seriesTable,
          rowId: ID.unique(),
          data: {
            exercise: s.exerciseId,
            sets: s.sets,
            targetValue: s.targetValue,
            rpe: s.rpe,
            weight: s.weight,
            restTime: s.restTime,
            order: s.order,
            training: newTraining.$id,
          },
          permissions: [
            Permission.read( Role.user( user.accountId ) ),
            Permission.update( Role.user( user.accountId ) ),
            Permission.delete( Role.user( user.accountId ) ),
          ],
        } )
      )
    );

    return {
      newTraining,
      createdSeries,
      message: {
        title: "Entraînement créé",
        body: "Ton entraînement a été créé avec succès.",
      },
    };
  } catch ( error ) {
    console.error( "Erreur lors de la création de l'entraînement:", error );
    return {
      message: {
        title: "Erreur lors de la création",
        body: error instanceof Error ? error.message : "Impossible de créer l'entraînement",
      },
    };
  }
};

/**
 * Met à jour les informations d'un entraînement (sans les séries)
 */
export const updateTraining = async (
  trainingId: string,
  data: Partial<Pick<Training, "name" | "duration" | "days" | "note">>
) => {
  try {
    const updatedTraining = await tablesDB.updateRow( {
      databaseId,
      tableId: trainingTable,
      rowId: trainingId,
      data,
    } );

    return {
      updatedTraining,
      message: {
        title: "Entraînement modifié",
        body: "Ton entraînement a été modifié avec succès.",
      },
    };
  } catch ( error ) {
    console.error( "Erreur lors de la modification de l'entraînement:", error );
    return {
      message: {
        title: "Erreur lors de la modification",
        body: error instanceof Error ? error.message : "Impossible de modifier l'entraînement",
      },
    };
  }
};

/**
 * Supprime un entraînement et toutes ses séries
 */
export const deleteTraining = async ( trainingId: string ) => {
  try {
    const allSeries = await tablesDB.listRows( { databaseId, tableId: seriesTable } );
    const trainingSeries = allSeries.rows.filter( ( s ) => s.training === trainingId );

    await Promise.all(
      trainingSeries.map( ( s ) =>
        tablesDB.deleteRow( { databaseId, tableId: seriesTable, rowId: s.$id } )
      )
    );

    await tablesDB.deleteRow( { databaseId, tableId: trainingTable, rowId: trainingId } );

    return {
      message: {
        title: "Entraînement supprimé",
        body: "Ton entraînement a été supprimé avec succès.",
      },
    };
  } catch ( error ) {
    console.error( "Erreur lors de la suppression de l'entraînement:", error );
    return {
      message: {
        title: "Erreur lors de la suppression",
        body: error instanceof Error ? error.message : "Impossible de supprimer l'entraînement",
      },
    };
  }
};

/**
 * Met à jour une série existante
 */
export const updateSeries = async (
  seriesId: string,
  data: Partial<Pick<Series, "sets" | "targetValue" | "rpe" | "weight" | "restTime" | "order">>
) => {
  try {
    const updatedSeries = await tablesDB.updateRow( {
      databaseId,
      tableId: seriesTable,
      rowId: seriesId,
      data,
    } );

    return {
      updatedSeries,
      message: {
        title: "Série modifiée",
        body: "La série a été modifiée avec succès.",
      },
    };
  } catch ( error ) {
    console.error( "Erreur lors de la modification de la série:", error );
    return {
      message: {
        title: "Erreur lors de la modification",
        body: error instanceof Error ? error.message : "Impossible de modifier la série",
      },
    };
  }
};

/**
 * Supprime une série
 */
export const deleteSeries = async ( seriesId: string ) => {
  try {
    await tablesDB.deleteRow( { databaseId, tableId: seriesTable, rowId: seriesId } );

    return {
      message: {
        title: "Série supprimée",
        body: "La série a été supprimée avec succès.",
      },
    };
  } catch ( error ) {
    console.error( "Erreur lors de la suppression de la série:", error );
    return {
      message: {
        title: "Erreur lors de la suppression",
        body: error instanceof Error ? error.message : "Impossible de supprimer la série",
      },
    };
  }
};