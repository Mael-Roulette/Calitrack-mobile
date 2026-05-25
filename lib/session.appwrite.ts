import { Performances, Session } from "@/types/session";

import { User } from "@/types";
import { ID, Permission, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";

const databaseId = appwriteConfig.databaseId;
const sessionTable = appwriteConfig.sessionCollectionId;
const performanceTable = appwriteConfig.performanceCollectionId;

/**
 * Sauvegarde une session et toutes les performances associées
 */
export const saveSession = async (
  user: User,
  {
    trainingId,
    duration,
    note,
    performances,
  }: {
    trainingId: string;
    duration: number;
    note?: string;
    performances: Performances;
  }
) => {
  // Créer la session
  const newSession = await tablesDB.createRow( {
    databaseId,
    tableId: sessionTable,
    rowId: ID.unique(),
    data: {
      training: trainingId,
      duration,
      note: note ?? null,
    },
    permissions: [
      Permission.read( Role.user( user.accountId ) ),
      Permission.update( Role.user( user.accountId ) ),
      Permission.delete( Role.user( user.accountId ) ),
    ],
  } );

  // Créer une performance par série/set
  const performanceEntries = Object.entries( performances ).flatMap(
    ( [ seriesId, sets ] ) =>
      Object.entries( sets ).map( ( [ , achievedValue ] ) => ( {
        seriesId,
        achievedValue,
      } ) )
  );

  await Promise.all(
    performanceEntries.map( ( { seriesId, achievedValue } ) =>
      tablesDB.createRow( {
        databaseId,
        tableId: performanceTable,
        rowId: ID.unique(),
        data: {
          series: seriesId,
          achievedValue,
          session: newSession.$id,
        },
        permissions: [
          Permission.read( Role.user( user.accountId ) ),
          Permission.update( Role.user( user.accountId ) ),
          Permission.delete( Role.user( user.accountId ) ),
        ],
      } )
    )
  );

  return newSession;
};

/**
 * Récupère toutes les sessions de l'utilisateur, enrichies avec
 * l'entraînement associé (lui-même enrichi avec ses séries) et
 * les performances liées à chaque session.
 *
 * @returns {Promise<Session[]>} - Liste des sessions enrichies, triées de la plus récente à la plus ancienne
 * @throws {Error} - Si la récupération échoue
 */
export const getUserSessions = async (): Promise<Session[]> => {
  try {
    const [ sessionsResponse, performancesResponse, trainingsResponse, seriesResponse ] =
      await Promise.all( [
        tablesDB.listRows( { databaseId, tableId: sessionTable } ),
        tablesDB.listRows( { databaseId, tableId: performanceTable } ),
        tablesDB.listRows( { databaseId, tableId: appwriteConfig.trainingCollectionId } ),
        tablesDB.listRows( { databaseId, tableId: appwriteConfig.seriesCollectionId } ),
      ] );

    const sessions = sessionsResponse.rows;
    const allPerformances = performancesResponse.rows;
    const allTrainings = trainingsResponse.rows;
    const allSeries = seriesResponse.rows;

    const enrichedSessions = sessions.map( ( session ) => {
      // Performances liées à cette session
      const sessionPerformances = allPerformances.filter(
        ( p ) => p.session === session.$id
      );

      // Entraînement lié à cette session
      const trainingId =
        typeof session.training === "string"
          ? session.training
          : session.training?.$id;

      const training = allTrainings.find( ( t ) => t.$id === trainingId );

      // Séries de cet entraînement
      const trainingSeries = training
        ? allSeries
          .filter( ( s ) => s.training === training.$id )
          .sort( ( a, b ) => ( a.order as number ) - ( b.order as number ) )
        : [];

      return {
        ...session,
        performances: sessionPerformances,
        training: training
          ? { ...training, series: trainingSeries }
          : session.training,
      };
    } );

    // Du plus récent au plus ancien
    return enrichedSessions.sort(
      ( a, b ) =>
        new Date( b.$createdAt ).getTime() - new Date( a.$createdAt ).getTime()
    ) as unknown as Session[];
  } catch ( error ) {
    console.error( "Erreur lors de la récupération des sessions:", error );
    throw new Error(
      error instanceof Error ? error.message : "Impossible de récupérer les sessions"
    );
  }
};