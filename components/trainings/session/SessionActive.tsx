import { Series } from "@/types";
import { Performances } from "@/types/session";
import { useEffect, useState } from "react";
import SessionRest from "./SessionRest";
import SessionSerieActive from "./SessionSerieActive";

interface SessionActiveProps {
  series: Series[];
  currentIndex: number;
  onSeriesComplete: () => void;
  performances: Performances;
  setPerformances: React.Dispatch<React.SetStateAction<Performances>>;
}

type ActiveState = "series" | "rest";

export default function SessionActive ( {
  series,
  currentIndex,
  onSeriesComplete,
  performances,
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

    const isLastSet = currentSet >= currentSeries.sets;

    if ( isLastSet ) {
      onSeriesComplete();
    } else {
      setActiveState( "rest" );
    }
  };

  const handleRestComplete = () => {
    setCurrentSet( ( prev ) => prev + 1 );
    setActiveState( "series" );
  };

  if ( activeState === "rest" ) {
    return (
      <SessionRest
        restTime={ currentSeries.restTime ?? 60 }
        onRestComplete={ handleRestComplete }
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