import { SeriesParams } from "./series";

export interface createTrainingParams {
	name: string;
	days?: string[];
	duration: number;
	series?: string[];
	hours?: number;
	minutes?: number;
}

export interface updateTrainingParams {
	id: string;
	name?: string;
	days?: string[];
	duration?: number;
	series?: string[];
}

export interface Training {
	$id: string;
	user: string;
	name: string;
	days?: string[];
	duration: number;
	exercise?: Exercise[];
	series?: SeriesParams[];
}

export interface Exercise {
	$id: string;
	name: string;
	description?: string;
	type: string;
	difficulty: string;
	image?: string;
	format: "hold" | "repetition";
}