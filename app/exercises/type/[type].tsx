import ExerciseItem from "@/components/exercises/ExerciseItem";
import PageHeader from "@/components/headers/PageHeader";
import { useExercicesStore } from "@/store";
import { ExerciseType } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const LABELS: Record<ExerciseType, string> = {
  [ ExerciseType.PUSH ]: "Push",
  [ ExerciseType.PULL ]: "Pull",
};

export default function ExercisesByType () {
  const { type } = useLocalSearchParams<{ type: ExerciseType }>();

  const state = useExercicesStore( ( s ) => s.byType[ type ] );
  const fetchByType = useExercicesStore( ( s ) => s.fetchByType );
  const loadMore = useExercicesStore( ( s ) => s.loadMore );
  const refresh = useExercicesStore( ( s ) => s.refresh );

  useEffect( () => {
    if ( type ) fetchByType( type );
  }, [ fetchByType, type ] );

  const items = state?.items ?? [];

  return (
    <View className="flex-1">
      <PageHeader title={ LABELS[ type ] ?? "Exercices" } />

      <View className="flex-1 px-2 pt-4 pb-5">
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
            onEndReached={ () => loadMore( type ) }
            onEndReachedThreshold={ 0.5 }
            refreshing={ !!state?.isLoading }
            onRefresh={ () => refresh( type ) }
            ListFooterComponent={ state?.isLoadingMore ? <ActivityIndicator /> : null }
            ListEmptyComponent={
              <Text className="text-center text-primary-100 mt-4">
                { state?.error ?? "Aucun exercice trouvé" }
              </Text>
            }
            showsVerticalScrollIndicator={ false }
          />
        ) }
      </View>
    </View>
  );
}