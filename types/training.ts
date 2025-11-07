import { SeriesParams } from "./series";

export interface createTrainingParams {
	name: Training[ 'name' ];
	days?: Training[ 'days' ];
	duration: Training[ 'duration' ];
	series?: string[];
}

export interface updateTrainingParams {
	id: Training[ '$id' ];
	name?: Training[ 'name' ];
	days?: Training[ 'days' ];
	duration?: Training[ 'duration' ];
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