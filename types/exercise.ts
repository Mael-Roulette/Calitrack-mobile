import { Models } from "react-native-appwrite";

export interface Exercise extends Models.Row {
	image?: string;
	name: string;
	description: string;
	difficulty: string;
	type: ExerciseType;
	format: ExerciseFormat;
	isCustom: boolean;
}

export interface CreateExercise {
	name: string;
	description: string;
	type: ExerciseType;
	difficulty: string;
	format: ExerciseFormat;
  image?: string;
}

export interface UpdateExercise {
	$id: string;
	name: string;
	description: string;
	type: ExerciseType;
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

export enum ExerciseType {
	PUSH = "push",
	PULL = "pull"
}

export type Category = ExerciseType | "custom";