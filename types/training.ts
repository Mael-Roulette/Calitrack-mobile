import { SeriesParams } from "./series";

export interface createTrainingParams {
	name: Training[ 'name' ];
	days?: Training[ 'days' ];
	duration: Training[ 'duration' ];
	series?: string[];
}

export interface UpdateSeriesParams {
	id: string;
	exercise?: string;
	targetValue?: SeriesParams[ 'targetValue' ];
	sets?: SeriesParams[ 'sets' ];
	restTime?: SeriesParams[ 'restTime' ];
	rpe?: SeriesParams[ 'rpe' ];
	note?: SeriesParams[ 'note' ];
	order?: SeriesParams[ 'order' ];
}

export interface updateTrainingParams {
	id: string,
	name: string,
	days: string[],
	duration: number | undefined,
	series?: SeriesParams[],
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
	description: string;
	type: string;
	difficulty: string;
	image?: string;
	format: "hold" | "repetition";
	isCustom?: boolean;
}