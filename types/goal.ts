export interface Goal {
	$createdAt: string;
	$updatedAt: string;
	$id: string;
	title: string;
	progress: number;
	total: number;
	progressHistory: number[];
	state: "in-progress" | "finished";
}

export interface CreateGoalParams {
	title: string;
	progress?: number;
	total: number;
}

export interface UpdatedGoalParams {
	$id: string;
	updateDate: string;
	progress: number;
	state?: Goal[ "state" ];
}