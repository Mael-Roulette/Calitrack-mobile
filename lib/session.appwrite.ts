import { Performances, Session, SessionInput } from "@/types/session";

import { SESSIONS_TTL } from "@/constants/value";
import { User } from "@/types";
import { ID, Permission, Query, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";

const databaseId = appwriteConfig.databaseId;
const sessionTable = appwriteConfig.sessionCollectionId;
const performanceTable = appwriteConfig.performanceCollectionId;

export const saveSession = async (
  user: User,
  session: SessionInput,
  performances: Performances
) => {
  // Créer la session
  const newSession = await tablesDB.createRow( {
    databaseId,
    tableId: sessionTable,
    rowId: ID.unique(),
    data: session,
    permissions: [
      Permission.read( Role.user( user.accountId ) ),
      Permission.update( Role.user( user.accountId ) ),
      Permission.delete( Role.user( user.accountId ) ),
    ],
  } );

  const performanceEntries = Object.values( performances ).flatMap( ( sets ) =>
    Object.entries( sets ).map( ( [ setNumber, perf ] ) => ( {
      ...perf,
      setNumber: Number( setNumber ),
    } ) )
  );

  await Promise.all(
    performanceEntries.map( ( perf ) =>
      tablesDB.createRow( {
        databaseId,
        tableId: performanceTable,
        rowId: ID.unique(),
        data: {
          ...perf,
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
 * les performances liées à chaque session.
 *
 * @param skipCache - Si true, ignore le cache Appwrite (ttl: 0) pour forcer
 *                     une donnée fraîche. À utiliser juste après un `saveSession`,
 *                     puisque les écritures n'invalident pas le cache automatiquement.
 * @returns {Promise<Session[]>} - Liste des sessions enrichies, triées de la plus récente à la plus ancienne
 * @throws {Error} - Si la récupération échoue
 */
export const getUserSessions = async (
  skipCache = false
): Promise<Session[]> => {
  try {
    const ttl = skipCache ? 0 : SESSIONS_TTL;

    const sessionsResult = await tablesDB.listRows<Session>( {
      databaseId,
      tableId: sessionTable,
      total: false,
      ttl
    } );

    return sessionsResult.rows;
  } catch ( error ) {
    console.error( "Erreur lors de la récupération des sessions:", error );
    throw new Error(
      error instanceof Error
        ? error.message
        : "Impossible de récupérer les sessions"
    );
  }
};

export const getSessionById = async ( sessionId: string ): Promise<Session> => {
  const session = await tablesDB.getRow<Session>( {
    databaseId,
    tableId: sessionTable,
    rowId: sessionId,
    queries: [ Query.select( [ "*", "performance.*" ] ) ]
  } );

  return session;
};