import { Series, Training } from ".";

export interface Session {
    $id: string;
    training: Training;
    duration: number;
    note: string;
    $createdAt: Date;
}

export interface Performance {
    $id: string;
    series: Series;
    achievedValue: number;
    session: Session;
}