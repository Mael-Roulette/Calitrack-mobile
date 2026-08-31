import { Series } from "@/types";
import { Performances } from "@/types/session";
import SessionRest from "./SessionRest";
import SessionSeriesActive from "./SessionSeriesActive";

export type ActiveState = "series" | "rest";

interface SessionActiveProps {
  series: Series[];
  currentIndex: number;
  currentSet: number;
  activeState: ActiveState;
  onSeriesComplete: () => void;
  setPerformances: React.Dispatch<React.SetStateAction<Performances>>;
  setCurrentSet: React.Dispatch<React.SetStateAction<number>>;
  setActiveState: React.Dispatch<React.SetStateAction<ActiveState>>;
}

export default function SessionActive ( {
  series,
  currentIndex,
  currentSet,
  activeState,
  onSeriesComplete,
  setPerformances,
  setCurrentSet,
  setActiveState
}: SessionActiveProps ) {
  const currentSeries = series[ currentIndex ];

  const handleSetComplete = ( achievedValue: number ) => {
    const seriesId = currentSeries.$id;

    setPerformances( ( prev ) => ( {
      ...prev,
      [ seriesId ]: {
        ...( prev[ seriesId ] ?? {} ),
        [ currentSet ]: {
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

    const isLastSeries = currentSeries.$id === series[ series.length - 1 ]?.$id;
    const isLastSet = currentSet >= currentSeries.sets;

    if ( isLastSeries && isLastSet ) {
      onSeriesComplete();
    } else {
      setActiveState( "rest" );
    }
  };

  const handleRestComplete = () => {
    const isLastSet = currentSet >= currentSeries.sets;

    if ( isLastSet ) {
      onSeriesComplete();
    } else {
      setCurrentSet( ( prev ) => prev + 1 );
      setActiveState( "series" );
    }
  };

  const getNextExerciseName = () => {
    const isLastSet = currentSet >= currentSeries.sets;

    if ( !isLastSet ) {
      return currentSeries.exercise.name;
    }

    const nextSeries = series[ currentIndex + 1 ];
    return nextSeries?.exercise.name ?? "";
  };

  if ( activeState === "rest" ) {
    return (
      <SessionRest
        restTime={ currentSeries.restTime ?? 60 }
        onRestComplete={ handleRestComplete }
        nextExercise={ getNextExerciseName() }
      />
    );
  }

  return (
    <SessionSeriesActive
      series={ currentSeries }
      currentSet={ currentSet }
      totalSets={ currentSeries.sets }
      seriesNumber={ currentIndex + 1 }
      totalSeries={ series.length }
      onSetComplete={ handleSetComplete }
    />
  );
}