import { useExercicesStore } from "@/store";
import { Exercise, ExerciseType } from "@/types";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { ModalSelectableExerciseList } from "./ModalSelectableList";

interface TypeExercisesProps {
  type: ExerciseType;
  isSelected: ( id: string ) => boolean;
  onToggle: ( exercise: Exercise ) => void;
}

export const TypeExercises = ( { type, isSelected, onToggle }: TypeExercisesProps ) => {
  const state = useExercicesStore( ( s ) => s.byType[ type ] );
  const fetchByType = useExercicesStore( ( s ) => s.fetchByType );
  const loadMore = useExercicesStore( ( s ) => s.loadMore );
  const refresh = useExercicesStore( ( s ) => s.refresh );

  useEffect( () => {
    fetchByType( type );
  }, [ fetchByType, type ] );

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
      isLoadingMore={ state?.isLoadingMore }
      error={ state?.error }
      onEndReached={ () => loadMore( type ) }
      onRefresh={ () => refresh( type ) }
    />
  );
};