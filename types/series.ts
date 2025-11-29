import { Exercise } from ".";

export interface SeriesParams {
  $id: string;
  exercise: Exercise | string;
  targetValue: number;
  sets: number;
  restTime?: number;
  rpe: number;
  note?: string;
  order: number;
  training: string;
}

export interface CreateSeriesParams {
  exercise: string;
  targetValue: SeriesParams[ 'targetValue' ];
  sets: SeriesParams[ 'sets' ];
  restTime?: SeriesParams[ 'restTime' ];
  rpe: SeriesParams[ 'rpe' ];
  note?: SeriesParams[ 'note' ];
  order: SeriesParams[ 'order' ];
  training: SeriesParams[ 'training' ];
}