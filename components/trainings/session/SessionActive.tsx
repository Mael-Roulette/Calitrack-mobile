import { Series } from "@/types";
import { useEffect, useState } from "react";
import SessionRest from "./SessionRest";
import SessionSerieActive from "./SessionSerieActive";

interface SessionActiveProps {
    series: Series[];
    currentIndex: number;
    onSeriesComplete: () => void;
}

type ActiveState = "series" | "rest";

export default function SessionActive ( { series, currentIndex, onSeriesComplete }: SessionActiveProps ) {
  const [ activeState, setActiveState ] = useState<ActiveState>( "series" );
  const [ currentSet, setCurrentSet ] = useState( 1 );
  const currentSeries = series[ currentIndex ];

  // Reset le set quand on change de série
  useEffect( () => {
    setCurrentSet( 1 );
    setActiveState( "series" );
  }, [ currentIndex ] );

  const handleSetComplete = () => {
    if ( currentSet < currentSeries.sets ) {
      // Passer au repos avant la prochaine série
      setActiveState( "rest" );
    } else {
      // Série complète, passer à la suivante
      onSeriesComplete();
    }
  };

  const handleRestComplete = () => {
    setCurrentSet( prev => prev + 1 );
    setActiveState( "series" );
  };

  return (
    activeState === "series" ? (
      <SessionSerieActive
        series={ currentSeries }
        currentSet={ currentSet }
        totalSets={ currentSeries.sets }
        seriesNumber={ currentIndex + 1 }
        totalSeries={ series.length }
        onSetComplete={ handleSetComplete }
      />
    ) : (
      <SessionRest
        restTime={ currentSeries.restTime || 60 }
        onRestComplete={ handleRestComplete }
      />
    )
  );
}