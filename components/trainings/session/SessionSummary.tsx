import GoalItem from "@/components/goals/GoalItem";
import { Goal, Series, Training } from "@/types";
import { formatSecondsDuration } from "@/utils/string";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import SeriesCard from "../series/SeriesCard";

interface SummaryProps {
    training: Training;
    goals: Goal[];
}

const SessionSummary = ( { training, goals }: SummaryProps ) => {
  const [ trainingSeries, setTrainingSeries ] = useState<Series[]>( [] );
  const [ relatedGoals, setRelatedGoals ] = useState<Goal[]>( [] );

  /* ----- Affichage des bons exercices et objectifs ----- */
  useEffect( () => {
    if ( training && training.series ) {
      setTrainingSeries(
        training.series.sort(
          ( a: Series, b: Series ) => a.order - b.order
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
    <View className="px-5 pt-5 bg-background">
      <View>
        <View>
          <Text className='text-lg-custom mb-5'>
            <Text className="title-2">Durée : </Text>
            { formatSecondsDuration( training.duration, true, false )}
          </Text>
          <Text className="title-2 mb-3">Mes exercices ( { trainingSeries.length } )</Text>
          <FlatList
            data={ trainingSeries }
            renderItem={ ( { item }: { item: Series } ) => {
              return (
                <SeriesCard
                  serie={ item }
                />
              );
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
          <View className="mt-5 mb-5">
            <Text className='title-2 mb-3'>
              Objectifs liés à l&apos;entraînement
            </Text>
            <FlatList
              data={ relatedGoals }
              renderItem={ ( { item }: { item: Goal } ) => {
                return (
                  <GoalItem
                    key={ item.$id }
                    goal={ item }
                    canDelete={ false }
                  />
                );
              } }
              keyExtractor={ ( item ) => item.exercise.name }
              scrollEnabled={ false }
              showsVerticalScrollIndicator={ false }
            />
          </View>
        ) }

      </View>

    </View>
  );
};

export default SessionSummary;