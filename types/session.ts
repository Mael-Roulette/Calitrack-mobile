import { Models } from "react-native-appwrite";

export interface Session extends Models.Row {
    // Infos de la session
    duration: number; // en secondes
    note: string;
    performance: Performance[] | [];

    // Infos liées
    trainingId: string;
    trainingName: string;
    weekName: string;
}

export interface SessionInput {
  // Infos de la session
  duration: number; // en secondes
  note: string;

  // Infos liées
  trainingId: string;
  trainingName: string;
  weekName: string;
}

export interface Performance {
  $id: string;

  // Infos de la performance
  achievedValue: number;
  setNumber: number; // L'ordre des différentes performances dans la série

  // Infos de l'exercice
  exerciseName: string;
  exerciseImage: string;

  // Infos de la série
  rpe: number;
	weight: number;
  restTime?: number;
  order: number; // Ordre de la série dans l'entraînement
  targetValue: number;
}

export interface PerformanceInput {
  exerciseName: string;
  exerciseImage: string;
  rpe: number;
  weight: number;
  restTime?: number;
  order: number;
  setNumber: number;
  targetValue: number;
  achievedValue: number;
}

export interface PerformanceRecap {
    $id: string;
    series: string;
    achievedValue: number;
    session: Session;
}

export type Performances = Record<string, Record<string, PerformanceInput>>;