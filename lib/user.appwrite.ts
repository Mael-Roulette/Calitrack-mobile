import { CreateUserParams, SignInParams, User } from "@/types";
import { ID, Models, Query } from "react-native-appwrite";
import {
	account,
	appwriteConfig,
	avatars,
	functions,
	tablesDB
} from "./appwrite";

/**
 * Permet de créer un nouvel utilisateur
 * @param param0 - email, password, name
 * @returns {Promise<Models.Row>} - Document de l'utilisateur créé
 * @throws {Error} - Si l'utilisateur n'a pas pu être créé
 */
export const createUser = async ( {
	email,
	password,
	name,
}: CreateUserParams ): Promise<Models.Row> => {
	try {
		const newAccount = await account.create( { userId: ID.unique(), email, password, name } );
		if ( !newAccount ) throw Error;

		await signIn( { email, password } );

		const avatarUrl = avatars.getInitialsURL( name );

		return await tablesDB.createRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.userCollectionId,
			rowId: ID.unique(),
			data: { email, name, accountId: newAccount.$id, avatar: avatarUrl } as any,
		} )
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
		await account.createEmailPasswordSession( { email, password } );
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

		const currentUser = await tablesDB.listRows( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.userCollectionId,
			queries: [ Query.equal( "accountId", currentAccount.$id ) ]
		} )

		return currentUser.rows[ 0 ] as any;
	} catch ( e ) {
		throw new Error( e as string );
	}
};

/**
 * Permet de mettre à jour les données d'un utilisateur
 * @param data - Les données à mettre à jour
 * @returns {Promise<Models.Row>} - L'utilisateur mis à jour
 * @throws {Error} - Si la mise à jour a échoué ou si l'email est déjà utilisé
 */
export const updateUser = async ( data: Partial<User>, password?: string ): Promise<Models.Row> => {
	try {
		const currentUser = await getCurrentUser();

		// Vérifie si l'email est déjà utilisé par un autre utilisateur
		if ( data.email ) {
			const usersWithEmail = await tablesDB.listRows( {
				databaseId: appwriteConfig.databaseId,
				tableId: appwriteConfig.userCollectionId,
				queries: [ Query.equal( "email", data.email ) ]
			} )

			const emailUsedByOther = usersWithEmail.rows.some(
				( user: any ) => user.$id !== currentUser.$id
			);

			if ( emailUsedByOther ) {
				throw new Error( "Cet email est déjà utilisé par un autre utilisateur." );
			}
		}


		if ( data.name ) {
			await account.updateName( { name: data.name } );
		}

		if ( data.email && password ) {
			await account.updateEmail( { email: data.email, password } )
		}

		const updatedUser = await tablesDB.updateRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.userCollectionId,
			rowId: currentUser.$id,
			data
		} );

		return updatedUser;
	} catch ( e ) {
		throw new Error( e as string );
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

		const execution = await functions.createExecution( {
			functionId: appwriteConfig.deleteAccountFunctionId,
			body: JSON.stringify( { userId: currentUser.$id } ),
			async: false
		} );

		if ( execution.status !== "completed" ) {
			throw new Error( ( execution as any ).stderr || "Delete function failed" );
		}

		await tablesDB.deleteRow( {
			databaseId: appwriteConfig.databaseId,
			tableId: appwriteConfig.userCollectionId,
			rowId: currentUser.$id
		} );

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
export const logout = async (): Promise<void> => {
	try {
		await account.deleteSession( { sessionId: "current" } );
	} catch ( e ) {
		throw new Error( ( e as string ) || "Failed to logout" );
	}
};
