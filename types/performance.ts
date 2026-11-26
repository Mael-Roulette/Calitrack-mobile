import { Models } from "react-native-appwrite";
import { ExerciseFormat, Session } from ".";

export interface SessionPerformance extends Models.Row {
  // Infos de la performance
  achievedValue: number;
  setNumber: number; // L'ordre des différentes performances dans la série

  // Infos de l'exercice
  exerciseName: string;
  exerciseImage: string;
  exerciseFormat: ExerciseFormat;

  // Infos de la série
  rpe: number;
	weight: number;
  restTime?: number;
  order: number; // Ordre de la série dans l'entraînement
  targetValue: number;
  isMax: boolean;
}

export interface PerformanceInput {
  exerciseName: string;
  exerciseImage: string;
  exerciseFormat: ExerciseFormat;
  rpe: number;
  weight: number;
  restTime?: number;
  order: number;
  setNumber: number;
  targetValue: number;
  achievedValue: number;
  isMax: boolean;
}

export interface PerformanceRecap {
    $id: string;
    series: string;
    achievedValue: number;
    session: Session;
}

export type Performances = Record<string, Record<string, PerformanceInput>>;