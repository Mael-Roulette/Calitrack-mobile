import { Exercise } from ".";

export interface Goal {
	$id: string;
	exercise: Exercise;
	targetValue: number;
	progressHistory: number[];
	state: "in-progress" | "finish";
}