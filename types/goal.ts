import { Models } from "react-native-appwrite";
import { Exercise } from ".";

export interface Goal extends Models.Row {
  exercise: Exercise;
  targetValue: number;
  progressHistory: string;
  state: GoalState;
}

export enum GoalState {
  IN_PROGRESS = "in-progress",
  FINISHED = "finished",
}

export interface CreateGoalParams {
  exercise: string;
  progress: number;
  targetValue: number;
}

export interface UpdateGoalParams {
  $id: string;
  progress: number;
}