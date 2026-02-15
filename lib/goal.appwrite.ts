import { LIMITS } from "@/constants/value";
import { CreateGoalParams, Goal, UpdateGoalParams, User } from "@/types";
import { buildGoalObject } from "@/utils/goals";
import { ID, Permission, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";

const goalTable = appwriteConfig.goalCollectionId;
const databaseId = appwriteConfig.databaseId;

/**
 * Permet de créer un objectif pour un utilisateur
 * @param param0
 * @returns
 */
export const createGoal = async ( user: User, {
  exercise,
  progress,
  total,
}: CreateGoalParams ) => {
  // Vérifier limite objectifs actifs
  const existingGoals = await getGoalsFromUser();
  const activeGoals = existingGoals.filter(
    ( g ) => g.state === "in-progress"
  );

  if ( activeGoals.length >= LIMITS.MAX_GOALS ) {
    return {
      message: {
        title: "Limite atteinte",
        body: `Maximum ${LIMITS.MAX_GOALS} objectifs en cours.`,
      },
    };
  }

  const newRow = await tablesDB.createRow( {
    databaseId,
    tableId: goalTable,
    rowId: ID.unique(),
    data: {
      exercise,
      targetValue: total,
      progressHistory: [ progress ],
      state: "in-progress",
    },
    permissions: [
      Permission.read( Role.user( user.accountId ) ),
      Permission.update( Role.user( user.accountId ) ),
      Permission.delete( Role.user( user.accountId ) ),
    ],
  } );

  const goal = await buildGoalObject( newRow );

  return {
    goal,
    message: {
      title: "Objectif créé",
      body: "Ton objectif a été créé avec succès.",
    },
  };
};


/**
 * Permet de récupérer les objectifs de l'utilisateur connecté
 */
export const getGoalsFromUser = async (): Promise<Goal[]> => {
  const response = await tablesDB.listRows( {
    databaseId,
    tableId: goalTable,
  } );

  return Promise.all( response.rows.map( buildGoalObject ) );
};

/**
 * Permet de modifier un objectif existant
 */
export const updateGoal = async ( {
  $id,
  progress,
}: UpdateGoalParams ): Promise<Goal> => {
  const currentRow = await tablesDB.getRow( {
    databaseId,
    tableId: goalTable,
    rowId: $id,
  } );

  const progressHistory = currentRow.progressHistory ?? [];
  const updatedHistory = [ ...progressHistory, progress ];

  const newState =
    progress >= currentRow.targetValue
      ? "finished"
      : "in-progress";

  const updatedRow = await tablesDB.updateRow( {
    databaseId,
    tableId: goalTable,
    rowId: $id,
    data: {
      progressHistory: updatedHistory,
      state: newState,
    },
  } );

  return buildGoalObject( updatedRow );
};

/**
 * Permet de supprimer un objectif
 * @param id id de l'objectif à supprimer
 */
export const deleteGoal = async ( id: string ): Promise<void> => {
  await tablesDB.deleteRow( {
    databaseId,
    tableId: goalTable,
    rowId: id,
  } );
};
