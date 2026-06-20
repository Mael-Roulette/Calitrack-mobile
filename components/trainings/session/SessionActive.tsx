import { Series } from "@/types";
import { Performances } from "@/types/session";
import { useEffect, useState } from "react";
import SessionRest from "./SessionRest";
import SessionSerieActive from "./SessionSerieActive";

interface SessionActiveProps {
  series: Series[];
  currentIndex: number;
  onSeriesComplete: () => void;
  setPerformances: React.Dispatch<React.SetStateAction<Performances>>;
}

type ActiveState = "series" | "rest";

export default function SessionActive ( {
  series,
  currentIndex,
  onSeriesComplete,
  setPerformances
}: SessionActiveProps ) {
  const [ activeState, setActiveState ] = useState<ActiveState>( "series" );
  const [ currentSet, setCurrentSet ] = useState( 1 );

  const currentSeries = series[ currentIndex ];

  // Reset quand on change de série
  useEffect( () => {
    setCurrentSet( 1 );
    setActiveState( "series" );
  }, [ currentIndex ] );

  const handleSetComplete = ( achievedValue: number ) => {
    const seriesId = currentSeries.$id;

    setPerformances( ( prev ) => ( {
      ...prev,
      [ seriesId ]: {
        ...( prev[ seriesId ] ?? {} ),
        [ currentSet ]: achievedValue,
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
      // Encore des sets sur la série actuelle alors même exercice
      return currentSeries.exercise.name;
    }

    // Série terminée alors nom de la série suivante
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
    <SessionSerieActive
      series={ currentSeries }
      currentSet={ currentSet }
      totalSets={ currentSeries.sets }
      seriesNumber={ currentIndex + 1 }
      totalSeries={ series.length }
      onSetComplete={ handleSetComplete }
    />
  );
}