import { CreatePerformanceParams, CreateSessionParams } from "@/types/session";
import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";
import { getCurrentUser } from "./user.appwrite";

/**
 * Crée une nouvelle session d'entraînement
 */
export const createSession = async ( {
    training,
    duration,
    notes,
}: CreateSessionParams ) => {
    try {
        const currentUser = await getCurrentUser();
        if ( !currentUser ) throw Error( "Utilisateur non connecté" );

        const session = await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.sessionCollectionId,
            rowId: ID.unique(),
            data: {
                user: currentUser.$id,
                training,
                duration,
                notes: notes || "",
                $createdAt: new Date().toISOString(),
            }
        });

        return session;
    } catch ( e ) {
        throw new Error( e as string );
    }
};

/**
 * Crée une performance pour un set spécifique
 */
export const createPerformance = async ( {
    session,
    series,
    reachValue,
    notes,
}: CreatePerformanceParams ) => {
    try {
        const performance = await tablesDB.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.performanceCollectionId,
            rowId: ID.unique(),
            data: {
                session,
                series,
                reachValue,
                notes: notes || "",
                $createdAt: new Date().toISOString(),
            }
        });

        return performance;
    } catch ( e ) {
        throw new Error( e as string );
    }
};

/**
 * Met à jour une session (duration, notes finales)
 */
export const updateSession = async (
    sessionId: string,
    updates: Partial<CreateSessionParams>
) => {
    try {
        const session = await tablesDB.updateRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.sessionCollectionId,
            rowId: sessionId,
            data: updates
        });

        return session;
    } catch ( e ) {
        throw new Error( e as string );
    }
};

/**
 * Récupère les performances d'une session
 */
export const getSessionPerformances = async ( sessionId: string ) => {
    try {
        const performances = await tablesDB.listRows({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.performanceCollectionId,
            queries: [ Query.equal( "session", sessionId ) ]
        });

        return performances.rows;
    } catch ( e ) {
        throw new Error( e as string );
    }
};