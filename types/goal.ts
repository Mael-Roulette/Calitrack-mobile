export interface Goal {
	$createdAt: string;
	$updatedAt: string;
	$id?: string;
	title: string;
	type: any;
	progress: number;
	total: number;
	progressHistory: [];
	state: "in-progress" | "finish";
}

export interface GoalState {
	title: string;
	type: "push" | "pull";
	total: string;
	progress: number;
}

export interface createGoalParams {
	title: string;
	type: "push" | "pull";
	progress?: number;
	total: number;
}

export interface updatedGoalParams {
	$id?: string;
	updateDate: string;
	progress: number;
	state?: "in-progress" | "finish";
}