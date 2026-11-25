import { Models } from "react-native-appwrite";
import { CreateSeriesInput, Series } from "./series";

export interface Week extends Models.Row {
	name: string;
	order: number;
	trainings?: string[]
}

export interface WeekInput {
  name: string;
  order: number;
}

export interface Training extends Models.Row {
	name: string;
	series?: Series[];
	duration: number;
	days?: string[];
	note?: string;
	week: string;
}

export interface CreateTrainingInput {
  weekId: string,
  name: string;
  duration: number;
  days?: string[];
  note?: string;
  series: CreateSeriesInput[];
};

export interface UpdateTrainingInput {
  name: string;
  duration: number;
  days?: string[];
  note?: string;
}

export interface RenameTrainingInput {
  trainingId: string;
  newName: string;
}
