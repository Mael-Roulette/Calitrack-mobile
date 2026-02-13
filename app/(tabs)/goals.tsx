import GoalItem from "@/components/goals/GoalItem";
import SimpleHeader from "@/components/headers/SimpleHeader";
import EmptyState from "@/components/ui/EmptyState";
import { LIMITS } from "@/constants/value";
import { useGoalsStore } from "@/store";
import { router } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalsPage () {
  const {
    goals,
    isLoadingGoals,
    error,
    getActiveGoals,
    getFinishedGoals
  } = useGoalsStore();

  const inProgressGoals = getActiveGoals();
  const finishedGoals = getFinishedGoals();
  const activeGoalsCount = inProgressGoals.length;
  const canAddGoal = activeGoalsCount < LIMITS.MAX_GOALS;

  // Combiner les objectifs pour la FlatList
  const allGoals = [ ...inProgressGoals, ...finishedGoals ];

  const handleAddGoal = useCallback( () => {
    router.push( "/goal/add-goal" );
  }, [] );

  const renderGoalItem = useCallback( ( { item }: { item: any } ) => (
    <GoalItem goal={ item } />
  ), [] );

  const keyExtractor = useCallback( ( item: any ) => item.$id, [] );

  const renderHeader = useCallback( () => {
    if ( canAddGoal ) return null;

    return (
      <View className="mb-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
        <Text className="text-yellow-800 text-center font-sregular">
          Vous avez atteint le nombre maximum d&apos;objectifs en cours ({ LIMITS.MAX_GOALS }).
          Terminez ou supprimez un objectif pour en ajouter un nouveau.
        </Text>
      </View>
    );
  }, [ canAddGoal ] );

  const renderEmptyState = useCallback( () => (
    <View className="px-5">
      <EmptyState
        title="Aucun objectif en cours"
        buttonText="Ajouter un objectif"
        handlePress={ handleAddGoal }
      />
    </View>
  ), [ handleAddGoal ] );

  if ( error && !isLoadingGoals ) {
    return (
      <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } }>
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <SimpleHeader
        title="Mes objectifs"
        subtitle="Ajouter une progression en cliquant sur un objectif"
        count={ `${ activeGoalsCount }/${ LIMITS.MAX_GOALS }` }
        onAddPress={ canAddGoal ? handleAddGoal : undefined }
      />

      <View className="flex-1 bg-background">
        { isLoadingGoals ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FC7942" />
            <Text className="text mt-4">Chargement de vos objectifs...</Text>
          </View>
        ) : goals.length === 0 ? (
          <View className="px-5 pt-5">
            <EmptyState
              title="Aucun objectif créé"
              buttonText="Créer mon premier objectif"
              handlePress={ handleAddGoal }
            />
          </View>
        ) : (
          <FlatList
            data={ allGoals }
            renderItem={ renderGoalItem }
            keyExtractor={ keyExtractor }
            contentContainerStyle={ { padding: 20 } }
            showsVerticalScrollIndicator={ false }
            ListHeaderComponent={ renderHeader }
            ListEmptyComponent={ renderEmptyState }
          />
        ) }
      </View>
    </SafeAreaView>
  );
}