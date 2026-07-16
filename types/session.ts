export interface Session {
    $id: string;

    // Infos de la session
    duration: number; // en secondes
    note: string;
    performances: Performance[];
    $createdAt: Date;

    // Infos liées
    trainingId: string;
    trainingName: string;
    weekName: string;
}

export type SessionInput = Omit<Session, "$id" | "$createdAt" | "performances">;

export interface Performance {
  $id: string;

  // Infos de la performance
  achievedValue: number;

  // Infos de l'exercice
  exerciseName: string;
  exerciseImage: string;

  // Infos de la série
  rpe: number;
	weight: number;
  restTime?: number;
  order: number;
  targetValue: number;
}

export interface PerformanceInput {
  exerciseName: string;
  exerciseImage: string;
  rpe: number;
  weight: number;
  restTime?: number;
  order: number;
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