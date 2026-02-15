import { Exercise } from ".";

export interface Goal {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  exercise: Exercise;
  progress: number;
  total: number;
  progressHistory: number[];
  state: "in-progress" | "finished";
}

export interface CreateGoalParams {
  exercise: string; // ID de l'exercice
  progress: number;
  total: number;
}

export interface UpdateGoalParams {
  $id: string;
  progress: number;
}