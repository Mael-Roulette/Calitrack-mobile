import { LIMITS } from "@/constants/value";
import { User } from "@/types";
import { ID, Permission, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";

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
 */
export const createWeek = async ( user: User, {
  name,
  order
}: { name: string, order: number } ) => {
  const existingWeeks = await getUserWeeks();
  if ( existingWeeks.length >= LIMITS.MAX_WEEKS ) {
    return;
  }

  try {
    const newWeek = await tablesDB.createRow( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId,
      rowId: ID.unique(),
      data: { name, order },
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
 * Permet de dupliquer une semaine existante
 */
export const duplicateWeek = async ( user: User, weekId: string ) => {
  const existingWeeks = await getUserWeeks();

  if ( existingWeeks.length >= LIMITS.MAX_WEEKS ) {
    return {
      message: {
        title: "Limite atteinte",
        body: `Maximum ${LIMITS.MAX_WEEKS} semaines autorisées.`,
      },
    };
  }

  const sourceWeek = existingWeeks.find( ( w ) => w.$id === weekId );
  if ( !sourceWeek ) {
    return {
      message: { title: "Erreur", body: "Semaine introuvable." },
    };
  }

  try {
    const newWeek = await tablesDB.createRow( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId,
      rowId: ID.unique(),
      data: {
        name: `${sourceWeek.name} (copie)`,
        order: existingWeeks.length + 1,
      },
      permissions: [
        Permission.read( Role.user( user.accountId ) ),
        Permission.update( Role.user( user.accountId ) ),
        Permission.delete( Role.user( user.accountId ) ),
      ],
    } );

    return {
      newWeek,
      message: {
        title: "Semaine dupliquée",
        body: "Ta semaine a été dupliquée avec succès.",
      },
    };
  } catch ( error ) {
    return {
      message: {
        title: "Erreur lors de la duplication",
        body: error instanceof Error ? error.message : "Impossible de dupliquer la semaine",
      },
    };
  }
};

/**
 * Modifie le nom d'une semaine et swape les ordres si nécessaire.
 * Si newOrder est déjà pris par une autre semaine, les deux semaines
 * échangent leur ordre.
 *
 * @returns les données mises à jour : la semaine modifiée + l'éventuelle semaine swappée
 */
export const updateWeek = async (
  weekId: string,
  { name, newOrder }: { name: string; newOrder: number }
) => {
  const allWeeks = await getUserWeeks();
  const targetWeek = allWeeks.find( ( w ) => w.$id === weekId );

  if ( !targetWeek ) {
    return {
      message: { title: "Erreur", body: "Semaine introuvable." },
    };
  }

  const oldOrder = targetWeek.order as number;
  const conflictWeek = allWeeks.find(
    ( w ) => w.$id !== weekId && ( w.order as number ) === newOrder
  );

  try {
    const updatedWeek = await tablesDB.updateRow( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId,
      rowId: weekId,
      data: { name, order: newOrder },
    } );

    // Si une autre semaine occupait cet ordre, lui donner l'ancien ordre
    let swappedWeek = null;
    if ( conflictWeek ) {
      swappedWeek = await tablesDB.updateRow( {
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.weekCollectionId,
        rowId: conflictWeek.$id,
        data: { order: oldOrder },
      } );
    }

    return {
      updatedWeek,
      swappedWeek,
      swappedWeekId: conflictWeek?.$id ?? null,
      oldOrder,
      message: {
        title: "Semaine modifiée",
        body: "Ta semaine a été modifiée avec succès.",
      },
    };
  } catch ( error ) {
    return {
      message: {
        title: "Erreur lors de la modification",
        body: error instanceof Error ? error.message : "Impossible de modifier la semaine",
      },
    };
  }
};

/**
 * Permet de supprimer une semaine donnée
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

/**
 * récupération d'une semaine par son ID
 */
export const getWeekById = async ( weekId: string ) => {
  try {
    const response = await tablesDB.getRow( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId,
      rowId: weekId,
    } );

    return response;
  } catch ( error ) {
    console.log( error );
    return {
      message: {
        title: "Erreur lors de la récupération",
        body: error instanceof Error ? error.message : "Impossible de récupérer la semaine",
      },
    };
  }
};
