import ExerciseItem from "@/components/exercises/ExerciseItem";
import PageHeader from "@/components/headers/PageHeader";
import { LIMITS } from "@/constants/value";
import { useExercicesStore } from "@/store";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const KEY = "custom";

export default function CustomExercises () {
  const state = useExercicesStore( ( s ) => s.byType[ KEY ] );
  const fetchByType = useExercicesStore( ( s ) => s.fetchByType );
  const refresh = useExercicesStore( ( s ) => s.refresh );

  useEffect( () => {
    fetchByType( KEY );
  }, [ fetchByType ] );

  const items = state?.items ?? [];

  return (
    <View className="flex-1">
      <PageHeader
        title="Personnalisés"
        onRightPress={ () => router.push( "/exercises/add-exercise" ) }
      />

      <View className="flex-1 px-2 pt-4 pb-5">
        <Text className="indicator-text mb-4">
          Nombre d&apos;exercices personnalisés : { items.length } / { LIMITS.MAX_CUSTOM_EXERCISES }
        </Text>

        { state?.isLoading && !state.isLoaded ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={ items }
            numColumns={ 2 }
            keyExtractor={ ( item ) => item.$id }
            renderItem={ ( { item } ) => (
              <View style={ { flex: 1, maxWidth: "50%", padding: 5 } }>
                <ExerciseItem
                  exercise={ item }
                  onPress={ () =>
                    router.push( { pathname: "/exercises/[id]", params: { id: item.$id } } )
                  }
                />
              </View>
            ) }
            refreshing={ !!state?.isLoading }
            onRefresh={ () => refresh( KEY ) }
            ListEmptyComponent={
              <Text className="text-center text-primary-100 mt-4">
                { state?.error ?? "Aucun exercice personnalisé" }
              </Text>
            }
            showsVerticalScrollIndicator={ false }
          />
        ) }
      </View>
    </View>
  );
}