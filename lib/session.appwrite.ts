import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import { getCurrentUser } from "./user.appwrite";
import { CreatePerformanceParams, CreateSessionParams } from "@/types/session";

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

        const session = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.sessionCollectionId,
            ID.unique(),
            {
                user: currentUser.$id,
                training,
                duration,
                notes: notes || "",
                $createdAt: new Date().toISOString(),
            }
        );

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
        const performance = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.performanceCollectionId,
            ID.unique(),
            {
                session,
                series,
                reachValue,
                notes: notes || "",
                $createdAt: new Date().toISOString(),
            }
        );

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
        const session = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.sessionCollectionId,
            sessionId,
            updates
        );

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
        const performances = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.performanceCollectionId,
            [ Query.equal( "session", sessionId ) ]
        );

        return performances.documents;
    } catch ( e ) {
        throw new Error( e as string );
    }
};