import { LIMITS } from "@/constants/value";
import { User } from "@/types";
import { ID, Permission, Role } from "react-native-appwrite";
import { account, appwriteConfig, tablesDB } from "./appwrite";

/**
 * Permet de récupérer les semaines d'un utilisateur donné
 * @returns Les semaines de l'utilisateur
 */
export const getUserWeeks = async () => {
  try {
    const response = await tablesDB.listRows( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId
    } );

    return response.rows;
  } catch ( error ) {
    console.error( "Erreur lors de la récupération des semaines:", error );
    throw new Error(
      error instanceof Error ? error.message : "Impossible de récupérer les semaines"
    );
  }
};

/**
 * Permet de créer une nouvelle semaine pour un utilisateur donné
 * @param user L'utilisateur pour lequel créer la semaine
 * @param param1 Nom et ordre de la semaine
 */
export const createWeek = async ( user: User, {
  name,
  order
}: { name: string, order: number } ) => {
  // Vérifier la limite de semaines
  const existingWeeks = await getUserWeeks();
  if ( existingWeeks.length >= LIMITS.MAX_WEEKS ) {
    return;
  }

  const currentAccount = await account.get();
  const accountId = currentAccount.$id;
  console.log( user.accountId );
  console.log( accountId );

  try {
    const newWeek = await tablesDB.createRow( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId,
      rowId: ID.unique(),
      data: {
        name,
        order
      },
      permissions: [
        Permission.read( Role.user( user.accountId ) ),
        Permission.update( Role.user( user.accountId ) ),
        Permission.delete( Role.user( user.accountId ) ),
      ]
    } );

    return {
      newWeek,
      message: {
        title: "Semaine créée",
        body: "Ta semaine a été créée avec succès.",
      },
    };
  } catch ( error ) {
    console.log( error );
    return {
      message: {
        title: "Erreur lors de la création",
        body: error instanceof Error ? error.message : "Impossible de créer la semaine",
      },
    };
  }
};

/**
 * Permet de supprimer une semaine donnée
 * @param weekId l'id de la semaine à supprimer
 * @returns Retourne un message de succès ou d'erreur
 */
export const deleteWeek = async ( weekId: string ) => {
  try {
    await tablesDB.deleteRow( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId,
      rowId: weekId,
    } );

    return {
      message: {
        title: "Semaine supprimée",
        body: "Ta semaine a été supprimée avec succès.",
      },
    };
  } catch ( error ) {
    console.log( error );
    return {
      message: {
        title: "Erreur lors de la suppression",
        body: error instanceof Error ? error.message : "Impossible de supprimer la semaine",
      },
    };
  }
};
