import { LIMITS } from "@/constants/value";
import { CreateGoalParams, Goal, GoalState, UpdateGoalParams, User } from "@/types";
import { ID, Models, Permission, Query, Role } from "react-native-appwrite";
import { appwriteConfig, tablesDB } from "./appwrite";

const goalTable = appwriteConfig.goalCollectionId;
const databaseId = appwriteConfig.databaseId;

/**
 * Permet de créer un objectif pour un utilisateur
 * @param param0
 * @returns
 */
export const createGoal = async ( user: User, goalParams: CreateGoalParams ): Promise<Goal> => {
  const existingGoals = await getGoalsFromUser();
  const activeGoals = existingGoals.filter(
    ( g ) => g.state === "in-progress"
  );

  if ( activeGoals.length >= LIMITS.MAX_GOALS ) {
    throw new Error( `Limite atteinte, Maximum ${LIMITS.MAX_GOALS} objectifs en cours.` );
  }

  const progressHistory = {
    progress: goalParams.progress,
    date: new Date()
  };

  const newGoal = await tablesDB.createRow<Goal>( {
    databaseId,
    tableId: goalTable,
    rowId: ID.unique(),
    data: {
      exercise: goalParams.exercise,
      targetValue: goalParams.targetValue,
      progressHistory: JSON.stringify( [ progressHistory ] ),
      state: GoalState.IN_PROGRESS,
    } as unknown as Omit<Goal, keyof Models.Row>,
    permissions: [
      Permission.read( Role.user( user.accountId ) ),
      Permission.update( Role.user( user.accountId ) ),
      Permission.delete( Role.user( user.accountId ) ),
    ],
  } );

  return newGoal;
};


/**
 * Permet de récupérer les objectifs de l'utilisateur connecté
 */
export const getGoalsFromUser = async (): Promise<Goal[]> => {
  const goals = await tablesDB.listRows<Goal>( {
    databaseId,
    tableId: goalTable,
    queries: [
      Query.select( [ "*", "exercise.*" ] ),
      Query.orderDesc( "$createdAt" )
    ],
  } );

  return goals.rows;
};

/**
 * Permet de modifier un objectif existant
 */
export const updateGoal = async ( {
  $id,
  progress,
}: UpdateGoalParams ): Promise<Goal> => {
  const currentRow = await tablesDB.getRow<Goal>( {
    databaseId,
    tableId: goalTable,
    rowId: $id,
  } );

  const progressHistory = currentRow.progressHistory;
  const updatedHistory = [
    ...JSON.parse( progressHistory ),
    {
      progress,
      date: new Date()
    }
  ];

  const newState =
    progress >= currentRow.targetValue
      ? GoalState.FINISHED
      : GoalState.IN_PROGRESS;

  const updatedGoal = await tablesDB.updateRow<Goal>( {
    databaseId,
    tableId: goalTable,
    rowId: $id,
    data: {
      progressHistory: JSON.stringify( updatedHistory ),
      state: newState,
    },
  } );

  return updatedGoal;
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
