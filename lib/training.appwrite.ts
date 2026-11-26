import { LIMITS } from "@/constants/value";
import { CreateTrainingInput, Training, UpdateTrainingInput, User } from "@/types";
import { Series, SeriesInput, UpdateSeriesInput } from "@/types/series";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";
import { getExerciseById } from "./exercise.appwrite";

const databaseId = appwriteConfig.databaseId;
const trainingTable = appwriteConfig.trainingCollectionId;
const seriesTable = appwriteConfig.seriesCollectionId;

/**
 * Récupère tous les entraînements avec leurs séries enrichies
 */
export const getUserTrainings = async (): Promise<Training[]> => {
  try {
    const [ trainingsResponse, seriesResponse ] = await Promise.all( [
      tablesDB.listRows<Training>( { databaseId, tableId: trainingTable } ),
      tablesDB.listRows<Series>( { databaseId, tableId: seriesTable } ),
    ] );

    const enrichedSeries = await Promise.all(
      seriesResponse.rows.map( async ( s ) => {
        const exercise = await getExerciseById(
          typeof s.exercise === "string" ? s.exercise : s.exercise.$id
        );
        return { ...s, exercise };
      } )
    ) as Series[];

    return trainingsResponse.rows.map( ( training ) => ( {
      ...training,
      series: enrichedSeries
        .filter( ( s ) => s.training === training.$id )
        .sort( ( a, b ) => a.order - b.order ),
    } ) ) as Training[];
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
export const getTrainingsByWeek = async ( weekId: string ): Promise<Training[]> => {
  try {
    const allTrainings = await getUserTrainings();
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
  { weekId, name, duration, days, note, series }: CreateTrainingInput
): Promise<Training> => {
  const existingTrainings = await getTrainingsByWeek( weekId );
  if ( existingTrainings.length >= LIMITS.MAX_TRAININGS ) {
    throw new Error( `Limite atteinte. Maximum ${LIMITS.MAX_TRAININGS} entraînements par semaine.` );
  }

  try {
    const newTraining = await tablesDB.createRow<Training>( {
      databaseId,
      tableId: trainingTable,
      rowId: ID.unique(),
      data: {
        name,
        duration,
        days: days ?? [],
        note,
        week: weekId,
      },
      permissions: [
        Permission.read( Role.user( user.accountId ) ),
        Permission.update( Role.user( user.accountId ) ),
        Permission.delete( Role.user( user.accountId ) ),
      ],
    } );

    await Promise.all(
      series.map( ( s ) =>
        tablesDB.createRow( {
          databaseId,
          tableId: seriesTable,
          rowId: ID.unique(),
          data: {
            exercise: s.exerciseId,
            sets: s.sets,
            targetValue: s.targetValue,
            isMax: s.isMax,
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

    return newTraining;
  } catch ( error ) {
    throw new Error( `Erreur lors de la création de l'entraînement: ${ error }` );
  }
};

/**
 * Met à jour les informations d'un entraînement (sans les séries)
 */
export const updateTraining = async (
  trainingId: string,
  data: Partial<UpdateTrainingInput>
): Promise<Training> => {
  try {
    const updatedTraining = await tablesDB.updateRow<Training>( {
      databaseId,
      tableId: trainingTable,
      rowId: trainingId,
      data,
    } );

    return updatedTraining;
  } catch ( error ) {
    throw new Error( `Erreur lors de la modification de l'entraînement: ${ error }` );
  }
};

export const updateTrainingWithSeries = async (
  user: User,
  trainingId: string,
  data: Partial<UpdateTrainingInput>,
  series: SeriesInput[]
): Promise<Training> => {
  try {
    const existing = await tablesDB.listRows<Series>( {
      databaseId,
      tableId: seriesTable,
      queries: [ Query.equal( "training", trainingId ), Query.limit( 100 ) ],
    } );

    const existingIds = new Set( existing.rows.map( ( s ) => s.$id ) );
    const keptIds = new Set( series.filter( ( s ) => s.$id ).map( ( s ) => s.$id ) );

    const toUpdate = series.filter( ( s ) => s.$id && existingIds.has( s.$id ) );
    const toCreate = series.filter( ( s ) => !s.$id || !existingIds.has( s.$id ) );
    const toDelete = existing.rows.filter( ( s ) => !keptIds.has( s.$id ) );

    const updatedTraining = await tablesDB.updateRow<Training>( {
      databaseId, tableId: trainingTable, rowId: trainingId, data,
    } );

    // Créations / modifications d'abord, suppressions en dernier :
    // en cas d'erreur en cours de route, on ne perd aucune donnée.
    await Promise.all( [
      ...toUpdate.map( ( s ) =>
        tablesDB.updateRow( {
          databaseId,
          tableId: seriesTable,
          rowId: s.$id!,
          data: {
            exercise: s.exerciseId,
            sets: s.sets,
            targetValue: s.targetValue,
            isMax: s.isMax,
            rpe: s.rpe,
            weight: s.weight,
            restTime: s.restTime,
            order: s.order,
          },
        } )
      ),
      ...toCreate.map( ( s ) =>
        tablesDB.createRow( {
          databaseId,
          tableId: seriesTable,
          rowId: ID.unique(),
          data: {
            exercise: s.exerciseId,
            sets: s.sets,
            targetValue: s.targetValue,
            isMax: s.isMax,
            rpe: s.rpe,
            weight: s.weight,
            restTime: s.restTime,
            order: s.order,
            training: trainingId
          },
          permissions: [
            Permission.read( Role.user( user.accountId ) ),
            Permission.update( Role.user( user.accountId ) ),
            Permission.delete( Role.user( user.accountId ) ),
          ],
        } )
      ),
    ] );

    await Promise.all(
      toDelete.map( ( s ) =>
        tablesDB.deleteRow( { databaseId, tableId: seriesTable, rowId: s.$id } )
      )
    );

    return updatedTraining;
  } catch ( error ) {
    throw error instanceof Error ? error : new Error( String( error ) );
  }
};

/**
 * Supprime un entraînement et toutes ses séries
 */
export const deleteTraining = async ( trainingId: string ): Promise<void> => {
  try {
    const allSeries = await tablesDB.listRows( { databaseId, tableId: seriesTable } );
    const trainingSeries = allSeries.rows.filter( ( s ) => s.training === trainingId );

    await Promise.all(
      trainingSeries.map( ( s ) =>
        tablesDB.deleteRow( { databaseId, tableId: seriesTable, rowId: s.$id } )
      )
    );

    await tablesDB.deleteRow( { databaseId, tableId: trainingTable, rowId: trainingId } );
  } catch ( error ) {
    throw new Error( `Erreur lors de la suppression de l'entraînement: ${ error }` );
  }
};

/**
 * Met à jour une série existante
 */
export const updateSeries = async (
  seriesId: string,
  data: UpdateSeriesInput
): Promise<Series> => {
  try {
    const updatedSeries = await tablesDB.updateRow<Series>( {
      databaseId,
      tableId: seriesTable,
      rowId: seriesId,
      data,
    } );

    return updatedSeries;
  } catch ( error ) {
    throw new Error( `Erreur lors de la modification de la série: ${ error }` );
  }
};

/**
 * Supprime une série
 */
export const deleteSeries = async ( seriesId: string ): Promise<void> => {
  try {
    await tablesDB.deleteRow( { databaseId, tableId: seriesTable, rowId: seriesId } );
  } catch ( error ) {
    throw new Error( `Erreur lors de la suppression de la série: ${ error }` );
  }
};