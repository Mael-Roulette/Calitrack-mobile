import { CreateUserParams, SignInParams, User } from "@/types";
import { ID, Models, Query } from "react-native-appwrite";
import {
	account,
	appwriteConfig,
	avatars,
	databases,
	functions,
} from "./appwrite";

/**
 * Permet de créer un nouvel utilisateur
 * @param param0 - email, password, name
 * @returns {Promise<Models.Document>} - Document de l'utilisateur créé
 * @throws {Error} - Si l'utilisateur n'a pas pu être créé
 */
export const createUser = async ( {
	email,
	password,
	name,
}: CreateUserParams ): Promise<Models.Document> => {
	try {
		const newAccount = await account.create( ID.unique(), email, password, name );
		if ( !newAccount ) throw Error;

		await signIn( { email, password } );

		const avatarUrl = avatars.getInitialsURL( name );

		return await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{ email, name, accountId: newAccount.$id, avatar: avatarUrl }
		);
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de se connecter avec un email et un mot de passe
 * @param param0 - email, password
 * @returns {Promise<void>} - Si la connexion a réussi
 * @throws {Error} - Si la connexion a échoué
 */
export const signIn = async ( { email, password }: SignInParams ): Promise<void> => {
	try {
		await account.createEmailPasswordSession( email, password );
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de récupérer l'utilisateur actuellement connecté
 * @returns {Promise<User>} - L'utilisateur actuellement connecté
 * @throws {Error} - Si l'utilisateur n'a pas pu être récupéré
 */
export const getCurrentUser = async (): Promise<User> => {
	try {
		const currentAccount = await account.get();
		if ( !currentAccount ) throw Error;

		const currentUser = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			[ Query.equal( "accountId", currentAccount.$id ) ]
		);

		return currentUser.documents[ 0 ] as any;
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de mettre à jour les données d'un utilisateur
 * @param data - Les données à mettre à jour
 * @returns {Promise<Models.Document>} - L'utilisateur mis à jour
 * @throws {Error} - Si la mise à jour a échoué ou si l'email est déjà utilisé
 */
export const updateUser = async ( data: Partial<User> ): Promise<Models.Document> => {
	try {
		const currentUser = await getCurrentUser();

		// Vérifie si l'email est déjà utilisé par un autre utilisateur
		if ( data.email ) {
			const usersWithEmail = await databases.listDocuments(
				appwriteConfig.databaseId,
				appwriteConfig.userCollectionId,
				[ Query.equal( "email", data.email ) ]
			);

			const emailUsedByOther = usersWithEmail.documents.some(
				( user: any ) => user.$id !== currentUser.$id
			);

			if ( emailUsedByOther ) {
				throw new Error( "Cet email est déjà utilisé par un autre utilisateur." );
			}
		}


		if ( data.name ) {
			await account.updateName( data.name );
		}

		const updatedUser = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			currentUser.$id,
			data
		);
		return updatedUser;
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de réinitialiser le mot de passe
 * @returns {Promise<{ success: boolean }>} - Si l'email de réinitialisation a été envoyé
 * @throws {Error} - Si l'email de réinitialisation n'a pas pu être envoyé
 */
export const updatePassword = async () => {
	try {
		const currentUser = await getCurrentUser();
		if ( !currentUser.email ) {
			throw new Error( "Aucun email associé à cet utilisateur" );
		}

		const redirectUrl = appwriteConfig.passwordRedirectUrl;

		await account.createRecovery( currentUser.email, redirectUrl );
		return { success: true };
	} catch ( e ) {
		console.error( "Password recovery error:", e );
	}
};

/**
 * Permet à l'utilisateur de supprimer définitivement son compte
 * @returns {Promise<void>} - Si la suppression a réussi
 * @throws {Error} - Si la suppression a échoué
 */
export const deleteAccount = async () => {
	try {
		const currentUser = await getCurrentUser();

		const execution = await functions.createExecution(
			appwriteConfig.deleteAccountFunctionId,
			JSON.stringify( { userId: currentUser.$id } ),
			false
		);

		if ( execution.status !== "completed" ) {
			throw new Error( ( execution as any ).stderr || "Delete function failed" );
		}

		await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			currentUser.$id
		);

		return { success: true };
	} catch ( e ) {
		console.error( "Account deletion error:", e );
		throw new Error( ( e as string ) || "Failed to delete account" );
	}
};

/**
 * Permet de se déconnecter de la session actuelle
 * @returns {Promise<void>} - Si la déconnexion a réussi
 * @throws {Error} - Si la déconnexion a échoué
 */
export const logout = async () => {
	try {
		const result = await account.deleteSession( "current" );
		return result;
	} catch ( e ) {
		throw new Error( ( e as string ) || "Failed to logout" );
	}
};
