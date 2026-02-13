import GoalItem from "@/components/goals/GoalItem";
import SimpleHeader from "@/components/headers/SimpleHeader";
import EmptyState from "@/components/ui/EmptyState";
import { LIMITS } from "@/constants/value";
import { useGoalsStore } from "@/store";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalsPage () {
  const { goals, isLoadingGoals, fetchUserGoals } = useGoalsStore();

  useEffect( () => {
    fetchUserGoals();
  }, [ fetchUserGoals ] );

  // Séparer les objectifs en cours et terminés
  const { inProgressGoals, finishedGoals } = useMemo( () => {
    const inProgress = goals.filter( ( goal ) => goal.state === "in-progress" );
    const finished = goals.filter( ( goal ) => goal.state === "finish" );

    return {
      inProgressGoals: inProgress,
      finishedGoals: finished,
    };
  }, [ goals ] );

  const activeGoalsCount = inProgressGoals.length;
  const canAddGoal = activeGoalsCount < LIMITS.MAX_GOALS;

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <SimpleHeader
        title="Mes objectifs"
        subtitle="Ajouter une progression en cliquant sur un objectif"
        count={ `${ activeGoalsCount }/${ LIMITS.MAX_GOALS }` }
        onAddPress={ canAddGoal ? () => router.push( "/goal/add-goal" ) : undefined }
      />

      <View className="flex-1 bg-background">
        { isLoadingGoals ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FC7942" />
            <Text className="text mt-4">Chargement de vos objectifs...</Text>
          </View>
        ) : (
          <>
            { goals.length === 0 ? (
              <View className="px-5 pt-5">
                <EmptyState
                  title="Aucun objectif créé"
                  buttonText="Créer mon premier objectif"
                  handlePress={ () => router.push( "/goal/add-goal" ) }
                />
              </View>
            ) : (
              <FlatList
                data={ [ ...inProgressGoals, ...finishedGoals ] }
                renderItem={ ( { item } ) => (
                  <GoalItem goal={ item } canDelete={ true } />
                ) }
                keyExtractor={ ( item ) => item.$id }
                contentContainerStyle={ { padding: 20 } }
                showsVerticalScrollIndicator={ false }
                ListHeaderComponent={
                  !canAddGoal ? (
                    <View className="mb-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                      <Text className="text-yellow-800 text-center font-sregular">
                        Vous avez atteint le nombre maximum d'objectifs en cours ({ LIMITS.MAX_GOALS }).
                        Terminez ou supprimez un objectif pour en ajouter un nouveau.
                      </Text>
                    </View>
                  ) : null
                }
                ListEmptyComponent={
                  <View className="px-5">
                    <EmptyState
                      title="Aucun objectif en cours"
                      buttonText="Ajouter un objectif"
                      handlePress={ () => router.push( "/goal/add-goal" ) }
                    />
                  </View>
                }
              />
            ) }
          </>
        ) }
      </View>
    </SafeAreaView>
  );
}