import { Exercise } from ".";

export interface Goal {
	$createdAt: string;
	$updatedAt: string;
	$id: string;
	exercise: Exercise;
	progress: number;
	total: number;
	progressHistory: number[];
	state: "in-progress" | "finish";
}

export interface CreateGoalParams {
	exercise: string;
	progress?: number;
	total: number;
}

export interface UpdatedGoalParams {
	$id: string;
	progress: number;
	state?: Goal[ "state" ];
}