export interface CreateSeriesParams {
  exercise: string;
  targetValue: number;
  sets: number;
  restime?: number;
  note?: string;
  order: number;
  training: string;
}

export interface SeriesParams {
  $id: string;
  exercise: string;
  targetValue: number;
  sets: number;
  restime?: number;
  note?: string;
  order: number;
  training: string;
}