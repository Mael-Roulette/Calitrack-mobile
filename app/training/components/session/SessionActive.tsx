import { SeriesParams } from "@/types/series";
import { useEffect, useState } from "react";
import { View } from "react-native";
import SessionRest from "./SessionRest";
import SessionSerieActive from "./SessionSerieActive";

interface SessionActiveProps {
    series: SeriesParams[];
    currentIndex: number;
    onSeriesComplete: () => void;
    onPerformanceRecorded: ( seriesId: string, setNumber: number, performance: number, notes?: string ) => void;
}

type ActiveState = "series" | "rest";

const SessionActive = ( { series, currentIndex, onSeriesComplete, onPerformanceRecorded }: SessionActiveProps ) => {
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

    const handlePerformanceSubmit = ( reachValue: number, notes?: string ) => {
        // Enregistrer la performance
        const seriesId = typeof currentSeries.exercise === "string"
            ? currentSeries.$id
            : currentSeries.$id;

        onPerformanceRecorded( seriesId, currentSet, reachValue, notes );
    };

    return (
        <View className="flex-1 px-5">
            { activeState === "series" ? (
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
                    onPerformanceSubmit={ handlePerformanceSubmit }
                    targetValue={ currentSeries.targetValue }
                    exerciseFormat={
                        typeof currentSeries.exercise === "string"
                            ? "repetition"
                            : currentSeries.exercise.format
                    }
                />
            ) }
        </View>
    );
};

export default SessionActive;