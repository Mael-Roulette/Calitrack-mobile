import ExerciseTypeItem from "@/components/exercises/ExerciseTypeItem";
import { EXERCISES_TYPES } from "@/constants/exercises";
import { Category } from "@/types";
import React from "react";
import { FlatList, View } from "react-native";

interface CategoryListProps {
  onSelect: ( category: Category ) => void;
}

export const CategoryList = ( { onSelect }: CategoryListProps ) => (
  <View className='flex-1 mb-4'>
    <FlatList
      data={ EXERCISES_TYPES }
      keyExtractor={ ( item ) => item.type }
      showsVerticalScrollIndicator={ false }
      renderItem={ ( { item } ) => (
        <ExerciseTypeItem
          handlePress={ () => onSelect( item.type ) }
          title={ item.label }
          description={ item.description }
        />
      ) }
      ListFooterComponent={
        <ExerciseTypeItem
          handlePress={ () => onSelect( "custom" ) }
          title='Personnalisés'
          description='Tes propres exercices'
        />
      }
    />
  </View>
);