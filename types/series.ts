import { Models } from "react-native-appwrite";
import { Exercise } from ".";

export interface Series extends Models.Row {
  exercise: Exercise;
  rpe: number;
	weight: number;
  sets: number;
  restTime?: number;
  order: number;
  training: string;
  targetValue: number;
  isMax: boolean;
}

export interface CreateSeriesInput {
  exerciseId: string;
  sets: number;
  targetValue?: number;
  isMax: boolean;
  rpe: number;
  weight: number | null;
  restTime: number; // en secondes
  order: number;
};

export interface UpdateSeriesInput {
  sets: number,
  targetValue?: number;
  isMax: boolean;
  rpe: number;
  weight: number;
  restTime: number; // en secondes
  order: number;
}

export interface SeriesInput {
  $id?: string;
  exerciseId: string;
  sets: number;
  targetValue?: number;
  isMax: boolean;
  rpe: number;
  weight: number;
  restTime: number;        // en secondes
  order: number;
}