import { Models } from "react-native-appwrite";
import { SessionPerformance } from ".";

export interface Session extends Models.Row {
    // Infos de la session
    duration: number; // en secondes
    note: string;
    performance: SessionPerformance[] | [];

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