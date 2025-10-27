export interface Goal {
	$createdAt: string;
	$updatedAt: string;
	$id?: string;
	title: string;
	progress: number;
	total: number;
	progressHistory: number[];
	state: "in-progress" | "finish";
}

export interface createGoalParams {
	title: string;
	progress?: number;
	total: number;
}

export interface updatedGoalParams {
	$id: string;
	updateDate: string;
	progress: number;
	state?: "in-progress" | "finish";
}