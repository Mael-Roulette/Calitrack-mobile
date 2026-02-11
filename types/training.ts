export interface Week {
	$id: string;
	name: string;
	order: number;
	trainings: Training[]
}

export interface Training {
	$id: string;
	name: string;
	series?: Series[];
	duration: number;
	days?: string[];
	note?: string;
	week: Week;
}

export interface Series {
  $id: string;
  exercise: Exercise;
  rpe: number;
	weight: number;
  sets: number;
  restTime?: number;
  order: number;
  training: Training;
  targetValue: number;
}

export interface Exercise {
	$id: string;
	image?: string;
	name: string;
	description: string;
	difficulty: string;
	type: string;
	format: "hold" | "repetition";
	isCustom?: boolean;
}