import { Series } from "@/types";
import { Performances } from "@/types/session";
import { useMemo, useState } from "react";
import { ActiveState, useSessionProgress } from "./useSessionProgress";

export type SessionState = "summary" | "active" | "completed";

export interface SessionSnapshot {
  sessionState: SessionState;
  currentSeriesIndex: number;
  currentSet: number;
  activeState: ActiveState;
  sessionStartTime: string; // ISO
  sessionDuration?: number;
  sessionNote: string;
  performances: Performances;
}

export function useSessionRun ( series: Series[] ) {
  const [ sessionState, setSessionState ] = useState<SessionState>( "summary" );
  const [ startTime, setStartTime ] = useState<Date>();
  const [ duration, setDuration ] = useState<number>();
  const [ note, setNote ] = useState( "" );
  const [ performances, setPerformances ] = useState<Performances>( {} );
  const [ progress, dispatch ] = useSessionProgress();

  const currentSeries = series[ progress.seriesIndex ];
  const isLastSeries = progress.seriesIndex === series.length - 1;

  const start = () => {
    dispatch( { type: "RESET" } );
    setStartTime( new Date() );
    setSessionState( "active" );
  };

  const finish = () => {
    if ( !startTime ) return;
    setDuration( Math.floor( ( Date.now() - startTime.getTime() ) / 1000 ) );
    setSessionState( "completed" );
  };

  const completeSet = ( achievedValue: number ) => {
    if ( !currentSeries ) return;

    const seriesId = currentSeries.$id;

    setPerformances( ( prev ) => ( {
      ...prev,
      [ seriesId ]: {
        ...( prev[ seriesId ] ?? {} ),
        [ progress.set ]: {
          exerciseName: currentSeries.exercise.name,
          exerciseImage: currentSeries.exercise.image,
          rpe: currentSeries.rpe,
          weight: currentSeries.weight,
          restTime: currentSeries.restTime,
          order: currentSeries.order,
          targetValue: currentSeries.targetValue,
          achievedValue,
        },
      },
    } ) );

    const isLastSet = progress.set >= currentSeries.sets;

    if ( isLastSeries && isLastSet ) finish();
    else dispatch( { type: "SET_DONE" } );
  };

  const completeRest = () => {
    if ( !currentSeries ) return;

    const isLastSet = progress.set >= currentSeries.sets;

    if ( isLastSet && isLastSeries ) {
      finish();
      return;
    }
    dispatch( { type: "REST_DONE", sets: currentSeries.sets } );
  };

  const nextExerciseName = !currentSeries
    ? ""
    : progress.set < currentSeries.sets
      ? currentSeries.exercise.name
      : series[ progress.seriesIndex + 1 ]?.exercise.name ?? "";

  const restore = ( saved: SessionSnapshot ) => {
    setSessionState( saved.sessionState );
    dispatch( {
      type: "RESTORE",
      payload: {
        seriesIndex: saved.currentSeriesIndex,
        set: saved.currentSet,
        activeState: saved.activeState,
      },
    } );
    setStartTime( new Date( saved.sessionStartTime ) );
    setDuration( saved.sessionDuration );
    setNote( saved.sessionNote );
    setPerformances( saved.performances );
  };

  // null tant que la séance n'a pas démarré : rien à sauvegarder
  const snapshot = useMemo<SessionSnapshot | null>( () => {
    if ( sessionState === "summary" || !startTime ) return null;
    return {
      sessionState,
      currentSeriesIndex: progress.seriesIndex,
      currentSet: progress.set,
      activeState: progress.activeState,
      sessionStartTime: startTime.toISOString(),
      sessionDuration: duration,
      sessionNote: note,
      performances,
    };
  }, [ sessionState, progress, startTime, duration, note, performances ] );

  return {
    sessionState,
    progress,
    currentSeries,
    duration,
    note,
    setNote,
    performances,
    nextExerciseName,
    snapshot,
    start,
    completeSet,
    completeRest,
    restore,
  };
}