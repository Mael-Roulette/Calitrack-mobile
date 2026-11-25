import { Models } from "react-native-appwrite";

export interface Exercise extends Models.Row {
	image?: string;
	name: string;
	description: string;
	difficulty: string;
	type: string;
	format: ExerciseFormat;
	isCustom: boolean;
}

export interface CreateExercise {
	name: string;
	description: string;
	type: string;
	difficulty: string;
	format: ExerciseFormat;
  image?: string;
}

export interface UpdateExercise {
	$id: string;
	name: string;
	description: string;
	type: string;
	difficulty: string;
	format: ExerciseFormat;
  image?: string
}

export interface UpdateExerciseImage {
  $id: string,
  imageUri: string
}

export enum ExerciseFormat {
  HOLD = "hold",
  REPETITION = "repetition"
}