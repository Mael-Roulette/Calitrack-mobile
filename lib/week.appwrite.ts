import { LIMITS } from "@/constants/value";
import { User } from "@/types";
import { ID, Permission, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";

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

export const createWeek = async ( user: User, {
  name,
  order
}: { name: string, order: number} ) => {
  const existingWeeks = await getUserWeeks();

  if ( existingWeeks.length >= LIMITS.MAX_WEEKS ) {
    return;
  }

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
    return {
      message: {
        title: "Erreur lors de la création",
        body: error instanceof Error ? error.message : "Impossible de créer la semaine",
      },
    };
  }
};