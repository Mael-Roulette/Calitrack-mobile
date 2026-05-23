import { Performances } from "@/types/session";

import { User } from "@/types";
import { ID, Permission, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";

const databaseId = appwriteConfig.databaseId;
const sessionTable = appwriteConfig.sessionCollectionId;
const performanceTable = appwriteConfig.performanceCollectionId;

/**
 * Sauvegarde une session et toutes les performances associées
 */
export const saveSession = async (
  user: User,
  {
    trainingId,
    duration,
    note,
    performances,
  }: {
    trainingId: string;
    duration: number;
    note?: string;
    performances: Performances;
  }
) => {
  // Créer la session
  const newSession = await tablesDB.createRow( {
    databaseId,
    tableId: sessionTable,
    rowId: ID.unique(),
    data: {
      training: trainingId,
      duration,
      note: note ?? null,
    },
    permissions: [
      Permission.read( Role.user( user.accountId ) ),
      Permission.update( Role.user( user.accountId ) ),
      Permission.delete( Role.user( user.accountId ) ),
    ],
  } );

  // Créer une performance par série/set
  const performanceEntries = Object.entries( performances ).flatMap(
    ( [ seriesId, sets ] ) =>
      Object.entries( sets ).map( ( [ , achievedValue ] ) => ( {
        seriesId,
        achievedValue,
      } ) )
  );

  await Promise.all(
    performanceEntries.map( ( { seriesId, achievedValue } ) =>
      tablesDB.createRow( {
        databaseId,
        tableId: performanceTable,
        rowId: ID.unique(),
        data: {
          series: seriesId,
          achievedValue,
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