import { Exercise } from ".";

export interface SeriesParams {
  $id: string;
  exercise: Exercise;
  targetValue: number;
  sets: number;
  restTime?: number;
  note?: string;
  order: number;
  training: string;
}

export interface CreateSeriesParams {
  exercise: SeriesParams[ 'exercise' ];
  targetValue: SeriesParams[ 'targetValue' ];
  sets: SeriesParams[ 'sets' ];
  restTime?: SeriesParams[ 'restTime' ];
  note?: SeriesParams[ 'note' ];
  order: SeriesParams[ 'order' ];
  training: SeriesParams[ 'training' ];
}