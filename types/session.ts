import { Training } from ".";

export interface Session {
    $id: string;
    training: Training;
    duration: number;
    note: string;
    performances: Performance[];
    $createdAt: Date;
}

export interface Performance {
    $id: string;
    series: string;
    achievedValue: number;
    session: Session;
}

export type Performances = Record<
  string, // seriesId
  Record<number, number> // setNumber -> value
>;
