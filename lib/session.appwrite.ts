import { Performances, Session, SessionInput } from "@/types/session";

import { MAX_PAGE_SIZE, SESSIONS_TTL } from "@/constants/value";
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
 * Récupère toutes les rows d'une table en paginant automatiquement
 * au-delà de la limite de 100 rows par requête Appwrite.
 */
const fetchAllRows = async (
  tableId: string,
  baseQueries: string[],
  ttl: number
) => {
  let allRows: any[] = [];
  let lastId: string | undefined;

  while ( true ) {
    const queries = [ ...baseQueries, Query.limit( MAX_PAGE_SIZE ) ];
    if ( lastId ) {
      queries.push( Query.cursorAfter( lastId ), Query.orderDesc( "$createdAt" ) );
    }

    const response = await tablesDB.listRows( {
      databaseId,
      tableId,
      queries,
      ttl,
    } );

    allRows = [ ...allRows, ...response.rows ];

    if ( response.rows.length < MAX_PAGE_SIZE ) break;

    lastId = response.rows[ response.rows.length - 1 ].$id;
  }

  return allRows;
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

    const sessions = await fetchAllRows( sessionTable, [], ttl );

    if ( sessions.length === 0 ) {
      return [];
    }

    const sessionIds = sessions.map( ( s ) => s.$id );

    const allPerformances = await fetchAllRows(
      performanceTable,
      [ Query.equal( "session", sessionIds ) ],
      ttl
    );

    const enrichedSessions = sessions.map( ( session ) => ( {
      ...session,
      $createdAt: new Date( session.$createdAt ),
      performances: allPerformances
        .filter( ( p ) => p.session === session.$id )
        .sort( ( a, b ) => a.order - b.order || a.setNumber - b.setNumber ),
    } ) );

    // Du plus récent au plus ancien
    return enrichedSessions.sort(
      ( a, b ) => b.$createdAt.getTime() - a.$createdAt.getTime()
    ) as unknown as Session[];
  } catch ( error ) {
    console.error( "Erreur lors de la récupération des sessions:", error );
    throw new Error(
      error instanceof Error
        ? error.message
        : "Impossible de récupérer les sessions"
    );
  }
};