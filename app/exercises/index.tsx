import ExerciseTypeItem from "@/components/exercises/ExerciseTypeItem";
import PageHeader from "@/components/headers/PageHeader";
import { EXERCISES_TYPES } from "@/constants/exercises";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";

const ExerciseList = () => {
  return (
    <View className="flex-1">
      <PageHeader
        title="Les mouvements"
        onRightPress={ () => router.push( "/exercises/add-exercise" ) }
      />

      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={ false }>
        { EXERCISES_TYPES.map( ( { type, label, description } ) => (
          <ExerciseTypeItem
            key={ type }
            handlePress={ () =>router.push( { pathname: "/exercises/type/[type]", params: { type } } ) }
            title={ label }
            description={ description }
          />
        ) ) }

        <ExerciseTypeItem
          handlePress={ () => router.push( "/exercises/custom" ) }
          title="Personnalisés"
          description="Tes propres exercices"
        />
      </ScrollView>
    </View>
  );
};

export default ExerciseList;