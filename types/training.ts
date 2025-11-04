import { Models } from "react-native-appwrite";

export interface createTrainingParams {
	name: string;
	days?: string[];
	duration: number;
	exercise?: Exercise[];
	hours?: number;
	minutes?: number;
}

export interface updateTrainingParams {
	id: string;
	name?: string;
	days?: string[];
	duration?: number;
	exercise?: Exercise[];
}

export interface Training extends Models.Document {
	$id: string;
	user: string;
	name: string;
	days?: string[];
	duration: number;
	exercise?: Exercise[];
}

export interface Exercise {
	$id: string;
	name: string;
	type: "push" | "pull";
	difficulty: string;
	image?: string;
	format: "hold" | "repetition";
}