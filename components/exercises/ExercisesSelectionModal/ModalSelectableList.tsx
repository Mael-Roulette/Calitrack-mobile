import { Exercise } from "@/types";
import React from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";
import ExerciseSelectionItem from "../ExerciseSelectionItem";

interface SelectableExerciseListProps {
  items: Exercise[];
  isSelected: ( id: string ) => boolean;
  onToggle: ( exercise: Exercise ) => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  error?: string | null;
  onEndReached?: () => void;
  onRefresh?: () => void;
}

export const ModalSelectableExerciseList = ( {
  items,
  isSelected,
  onToggle,
  isLoading,
  isLoadingMore,
  error,
  onEndReached,
  onRefresh,
}: SelectableExerciseListProps ) => (
  <FlatList
    className='flex-1 mb-4'
    data={ items }
    showsVerticalScrollIndicator={ false }
    keyExtractor={ ( item ) => item.$id }
    onEndReached={ onEndReached }
    onEndReachedThreshold={ 0.5 }
    refreshing={ !!isLoading }
    onRefresh={ onRefresh }
    ListFooterComponent={ isLoadingMore ? <ActivityIndicator /> : null }
    ListEmptyComponent={
      <Text className='text-center text-primary-100 mt-4'>
        { error ?? "Aucun exercice trouvé" }
      </Text>
    }
    renderItem={ ( { item } ) => (
      <ExerciseSelectionItem
        image={ item.image }
        name={ item.name }
        difficulty={ item.difficulty }
        isCustom={ item.isCustom || false }
        selectable
        isSelected={ isSelected( item.$id ) }
        onPress={ () => onToggle( item ) }
      />
    ) }
  />
);