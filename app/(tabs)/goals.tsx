import GoalItem from "@/components/goals/GoalItem";
import SimpleHeader from "@/components/headers/SimpleHeader";
import EmptyState from "@/components/ui/EmptyState";
import { LIMITS } from "@/constants/value";
import { useGoalsStore } from "@/store";
import { Goal } from "@/types";
import { router } from "expo-router";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function GoalsPage () {
  const {
    isLoading,
    error,
    getActiveGoals,
    getFinishedGoals
  } = useGoalsStore();

  const inProgressGoals = getActiveGoals();
  const finishedGoals = getFinishedGoals();
  const activeGoalsCount = inProgressGoals.length;
  const canAddGoal = activeGoalsCount < LIMITS.MAX_GOALS;

  const handleAddGoal = () => {
    router.push( "/goal/add-goal" );
  };

  if ( error && !isLoading ) {
    return (
      <View className="flex-1">
        <SimpleHeader
          title="Mes objectifs"
          subtitle="Ajouter une progression en cliquant sur un objectif"
          count={ `${ activeGoalsCount }/${ LIMITS.MAX_GOALS }` }
          onAddPress={ canAddGoal ? handleAddGoal : undefined }
        />
        <View className="flex-1 bg-background justify-center items-center px-5">
          <Text className="text text-red-500 text-center mb-4">{ error }</Text>
          <Text className="text text-center">
            Une erreur est survenue lors du chargement de vos objectifs.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <SimpleHeader
        title="Mes objectifs"
        subtitle="Ajouter une progression en cliquant sur un objectif"
        count={ `${ activeGoalsCount }/${ LIMITS.MAX_GOALS }` }
        onAddPress={ canAddGoal ? handleAddGoal : undefined }
      />

      <View className="flex-1 bg-background">
        { isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FC7942" />
            <Text className="text mt-4">Chargement de vos objectifs...</Text>
          </View>
        ) : (
          <ScrollView className="flex-col gap-6 pt-5">
            {inProgressGoals.length === 0 ? (
              <View className="px-5">
                <EmptyState
                  title="Aucun objectif en cours"
                  buttonText="Ajouter un objectif"
                  handlePress={ handleAddGoal }
                />
              </View>
            ) : (
              <View className="px-5">
                <Text className="title-2 mb-3">Mes objectifs en cours</Text>
                { inProgressGoals.map( ( goal: Goal ) => (
                  <GoalItem key={ goal.$id } goal={ goal } />
                ) )}
              </View>
            )}

            { finishedGoals.length !== 0 &&
              <View className="px-5">
                <Text className="title-2 mb-3">Mes objectifs finis</Text>
                { finishedGoals.map( ( goal: Goal ) => (
                  <GoalItem key={ goal.$id } goal={ goal } />
                ) )}
              </View>
            }
          </ScrollView>
        ) }
      </View>
    </View>
  );
}