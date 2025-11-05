export interface createTrainingParams {
	name: string;
	days?: string[];
	duration: number;
	exercises?: string[]; // IDs des exercices
	hours?: number;
	minutes?: number;
}

export interface updateTrainingParams {
	id: string;
	name?: string;
	days?: string[];
	duration?: number;
	exercises?: string[]; // IDs des exercices
}

export interface Training {
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
	description?: string;
	type: string;
	difficulty: string;
	image?: string;
	format: "hold" | "repetition";
}