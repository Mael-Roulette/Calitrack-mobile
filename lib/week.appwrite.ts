import { LIMITS } from "@/constants/value";
import { Training, User, Week, WeekInput } from "@/types";
import { Series } from "@/types/series";
import { ID, Permission, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";
import { getUserTrainings } from "./training.appwrite";

/**
 * Permet de récupérer les semaines d'un utilisateur donné
 * @returns Les semaines de l'utilisateur
 */
export const getUserWeeks = async (): Promise<Week[]> => {
  try {
    const response = await tablesDB.listRows<Week>( {
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
}: WeekInput ): Promise<Week> => {
  const existingWeeks = await getUserWeeks();
  if ( existingWeeks.length >= LIMITS.MAX_WEEKS ) {
    throw new Error( `Limite atteinte. Maximum ${LIMITS.MAX_WEEKS} semaines autorisées.` );
  }

  try {
    const newWeek = await tablesDB.createRow<Week>( {
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

    return newWeek;
  } catch ( error ) {
    throw new Error( `Erreur lors de la création de la semaine: ${error}` );
  }
};

/**
 * Permet de dupliquer une semaine existante
 */
export const duplicateWeek = async ( user: User, weekId: string ): Promise<Week> => {
  const existingWeeks = await getUserWeeks();

  if ( existingWeeks.length >= LIMITS.MAX_WEEKS ) {
    throw new Error( `Limite atteinte. Maximum ${LIMITS.MAX_WEEKS} semaines autorisées.` );
  }

  const sourceWeek = existingWeeks.find( ( w ) => w.$id === weekId );
  if ( !sourceWeek ) {
    throw new Error( "Semaine à dupliquer introuvable." );
  }

  try {
    const newWeek = await tablesDB.createRow<Week>( {
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

    const trainings: Training[] = await getUserTrainings();
    const sourceTrainings = trainings.filter( t => t.week === weekId );

    for ( const training of sourceTrainings ) {
      const newTraining = await tablesDB.createRow<Training>( {
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.trainingCollectionId,
        rowId: ID.unique(),
        data: {
          name: training.name,
          duration: training.duration,
          days: training.days ?? [],
          note: training.note,
          week: newWeek.$id,
        },
        permissions: [
          Permission.read( Role.user( user.accountId ) ),
          Permission.update( Role.user( user.accountId ) ),
          Permission.delete( Role.user( user.accountId ) ),
        ],
      } );

      // dupliquer les séries
      const trainingSeries = training.series ?? [];

      await Promise.all(
        trainingSeries.map( ( s ) =>
          tablesDB.createRow<Series>( {
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.seriesCollectionId,
            rowId: ID.unique(),
            data: {
              exercise: s.exercise,
              sets: s.sets,
              targetValue: s.targetValue,
              rpe: s.rpe,
              weight: s.weight,
              restTime: s.restTime,
              order: s.order,
              isMax: s.isMax,
              training: newTraining.$id,
            },
            permissions: [
              Permission.read( Role.user( user.accountId ) ),
              Permission.update( Role.user( user.accountId ) ),
              Permission.delete( Role.user( user.accountId ) ),
            ],
          } )
        )
      );
    }

    return newWeek;
  } catch ( error ) {
    throw new Error( `Erreur lors de la duplication de la semaine: ${error}` );
  }
};

/**
 * Modifie le nom d'une semaine et swap les ordres si nécessaire.
 * Si newOrder est déjà pris par une autre semaine, les deux semaines
 * échangent leur ordre.
 *
 * @returns les données mises à jour : la semaine modifiée + l'éventuelle semaine swapée
 */
export const updateWeek = async (
  weekId: string,
  { name, order }: WeekInput
): Promise<Week> => {
  const allWeeks = await getUserWeeks();
  const targetWeek = allWeeks.find( ( w ) => w.$id === weekId );

  if ( !targetWeek ) {
    throw new Error( `Identifiant de la semaine introuvable: ${weekId}` );
  }

  const oldOrder = targetWeek.order as number;
  const conflictWeek = allWeeks.find(
    ( w ) => w.$id !== weekId && ( w.order as number ) === order
  );

  try {
    const updatedWeek = await tablesDB.updateRow<Week>( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId,
      rowId: weekId,
      data: { name, order },
    } );

    // Si une autre semaine occupait cet ordre, lui donner l'ancien ordre
    if ( conflictWeek ) {
      await tablesDB.updateRow<Week>( {
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.weekCollectionId,
        rowId: conflictWeek.$id,
        data: { order: oldOrder },
      } );
    }

    return updatedWeek;
  } catch ( error ) {
    throw new Error( `Erreur lors de la modification de la semaine: ${error}` );
  }
};

/**
 * Permet de supprimer une semaine donnée
 */
export const deleteWeek = async ( weekId: string ): Promise<void> => {
  try {
    await tablesDB.deleteRow( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId,
      rowId: weekId,
    } );
  } catch ( error ) {
    throw new Error( `Erreur lors de la suppression de la semaine: ${error}` );
  }
};

/**
 * récupération d'une semaine par son ID
 */
export const getWeekById = async ( weekId: string ): Promise<Week> => {
  try {
    const week = await tablesDB.getRow<Week>( {
      databaseId: appwriteConfig.databaseId,
      tableId: appwriteConfig.weekCollectionId,
      rowId: weekId,
    } );

    return week;
  } catch ( error ) {
    throw new Error( `Erreur lors de la récupération de la semaine: ${error}` );
  }
};
