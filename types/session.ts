export type SessionState = "summary" | "active" | "rest" | "completed";

export interface SessionData {
    trainingId: string;
    startTime: Date;
    currentSeriesIndex: number;
    completedSets: Map<string, number>;
    state: SessionState;
}

export interface SeriesProgress {
    seriesId: string;
    currentSet: number;
    totalSets: number;
    completed: boolean;
}