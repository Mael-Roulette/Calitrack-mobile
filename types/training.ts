export interface createTrainingParams {
	name: string;
	days?: string[];
	duration: number;
	exercise?: string[];
	hours?: number;
	minutes?: number;
}

export interface updateTrainingParams {
	id: string;
	name?: string;
	days?: string[];
	duration?: number;
	exercise?: string[];
}

export interface Training {
	$id: string;
	user: string;
	name: string;
	days?: string[];
	duration: number;
	exercise?: string[];
}

export interface Exercise {
	$id: string;
	name: string;
	type: "push" | "pull";
	difficulty: string;
	image?: string;
	format: "hold" | "repetition";
}