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

export default function SessionActive ( {
  series,
  currentIndex,
  onSeriesComplete,
}: SessionActiveProps ) {
  const [ activeState, setActiveState ] = useState<ActiveState>( "series" );
  const [ currentSet, setCurrentSet ] = useState( 1 );
  // Stocke les performances saisies : seriesIndex -> setNumber -> achievedValue
  const [ performances, setPerformances ] = useState<Record<number, Record<number, number>>>( {} );

  const currentSeries = series[ currentIndex ];

  // Reset quand on change de série
  useEffect( () => {
    setCurrentSet( 1 );
    setActiveState( "series" );
  }, [ currentIndex ] );

  const handleSetComplete = ( achievedValue: number ) => {
    // Sauvegarder la performance de ce set
    setPerformances( ( prev ) => ( {
      ...prev,
      [ currentIndex ]: {
        ...( prev[ currentIndex ] ?? {} ),
        [ currentSet ]: achievedValue,
      },
    } ) );

    const isLastSet = currentSet >= currentSeries.sets;

    if ( isLastSet ) {
      // Dernière série ET dernier set → fin de l'exercice
      onSeriesComplete();
    } else {
      // Il reste des sets → repos avant le suivant
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