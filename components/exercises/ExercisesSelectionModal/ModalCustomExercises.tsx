import { useExercicesStore } from "@/store";
import { Exercise } from "@/types";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { ModalSelectableExerciseList } from "./ModalSelectableList";

interface CustomExercisesProps {
  isSelected: ( id: string ) => boolean;
  onToggle: ( exercise: Exercise ) => void;
}

export const ModalCustomExercises = ( { isSelected, onToggle }: CustomExercisesProps ) => {
  const state = useExercicesStore( ( s ) => s.byType.custom );
  const fetchByType = useExercicesStore( ( s ) => s.fetchByType );
  const refresh = useExercicesStore( ( s ) => s.refresh );

  useEffect( () => {
    fetchByType( "custom" );
  }, [ fetchByType ] );

  if ( state?.isLoading && !state.isLoaded ) {
    return (
      <View className='flex-1'>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ModalSelectableExerciseList
      items={ state?.items ?? [] }
      isSelected={ isSelected }
      onToggle={ onToggle }
      isLoading={ state?.isLoading }
      error={ state?.error }
      onRefresh={ () => refresh( "custom" ) }
    />
  );
};