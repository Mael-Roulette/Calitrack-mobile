import { Goal, Training } from "@/types"
import { View, Text, FlatList } from "react-native"
import { useEffect, useState } from "react";
import { SeriesParams } from "@/types/series";
import SeriesItem from "../SeriesItem";
import GoalItem from "@/app/goal/components/GoalItem";

interface SummaryProps {
    training: Training;
    goals: Goal[];
}

const SessionSummary = ( { training, goals }: SummaryProps ) => {
    const [ trainingSeries, setTrainingSeries ] = useState<SeriesParams[]>( [] );
    const [ relatedGoals, setRelatedGoals ] = useState<Goal[]>( [] );

    /* ----- Affichage des bons exercices et objectifs ----- */
    useEffect( () => {
        if ( training && training.series ) {
            setTrainingSeries(
                training.series.sort(
                    ( a: SeriesParams, b: SeriesParams ) => a.order - b.order
                )
            );
        }

        if ( !trainingSeries.length || !goals.length ) {
            setRelatedGoals( [] );
            return;
        }

        const exerciseTypes = new Set(
            trainingSeries.map( ex =>
                typeof ex.exercise === "string" ? ex.exercise : ex.exercise.type
            )
        );

        // Filtrer les goals
        const related = goals.filter( goal => ( exerciseTypes.has( goal.exercise.type ) && goal.state === "in-progress" ) );

        setRelatedGoals( related );
    }, [ training, goals, trainingSeries ] );

    return (
        <View className="px-5">
            <View>
                <View>
                    <Text className='text mb-5'>
                        <Text className="title-3">Durée: </Text> { Math.floor( training.duration / 3600 ) > 0
                            ? `${Math.floor( training.duration / 3600 )}h${Math.floor( ( training.duration % 3600 ) / 60 ) > 0 ? Math.floor( ( training.duration % 3600 ) / 60 ) : ""}`
                            : `${Math.floor( ( training.duration % 3600 ) / 60 )} min` }
                    </Text>
                    <Text className="title-3 mb-3">Mes exercices</Text>
                    <FlatList
                        data={ trainingSeries }
                        renderItem={ ( { item }: { item: SeriesParams } ) => {
                            return (
                                <SeriesItem
                                    seriesData={ item }
                                />
                            )
                        } }
                        keyExtractor={ ( item ) => item.$id }
                        showsVerticalScrollIndicator={ true }
                        scrollEnabled={ false }
                        ListEmptyComponent={
                            <Text className='indicator-text'>Aucune série</Text>
                        }
                    />
                </View>

                { relatedGoals && relatedGoals.length > 0 && (
                    <View className="mt-5">
                        <Text className='title-3 mb-3'>
                            Objectifs liés à l&apos;entraînement
                        </Text>
                        <FlatList
                            data={ relatedGoals }
                            renderItem={ ( { item }: { item: Goal } ) => {
                                return (
                                    <GoalItem
                                        key={ item.$id }
                                        $id={ item.$id }
                                        exercise={ item.exercise }
                                        progress={ item.progress }
                                        total={ item.total }
                                        state={ item.state }
                                    />
                                )
                            } }
                            keyExtractor={ ( item ) => item.exercise.name }
                            scrollEnabled={ false }
                            showsVerticalScrollIndicator={ false }
                        />
                    </View>
                ) }

            </View>

        </View>
    )
}

export default SessionSummary;