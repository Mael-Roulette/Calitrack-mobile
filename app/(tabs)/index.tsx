import GoalItem from "@/components/goals/GoalItem";
import HomeHeader from "@/components/headers/HomeHeader";
import TrainingDay from "@/components/trainings/TrainingDay";
import EmptyState from "@/components/ui/EmptyState";
import { useTodayTraining } from "@/hooks/useTodayTraining";
import { useAuthStore, useExercicesStore, useGoalsStore } from "@/store";
import useTrainingsStore from "@/store/training.store";
import useWeeksStore from "@/store/week.store";
import { Goal } from "@/types";
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage () {
  const { user, isLoading } = useAuthStore();
  const { fetchUserGoals, getActiveGoals, isLoading: isGoalsLoading } = useGoalsStore();
  const { fetchExercises } = useExercicesStore();
  const { fetchUserWeeks } = useWeeksStore();
  const { fetchUserTrainings } = useTrainingsStore();
  const todayTraining = useTodayTraining();

  useEffect( () => {
    if ( !isLoading && !user ) {
      router.replace( "/(auth)" );
    }
  }, [ user, isLoading ] );

  useEffect( () => {
    fetchExercises();
    fetchUserGoals();
    fetchUserWeeks();
    fetchUserTrainings();
  }, [ user ] );

  const inProgressGoals = getActiveGoals();

  return (
    <View className="flex-1">
      { isLoading ? (
				<View>
					<Text className='title'>Chargement...</Text>
				</View>
			) : (
        <>
          <HomeHeader
            greeting={ `Salut ${user?.name}`}
            onCalendarPress={ () => {} }
          />

          <ScrollView className="flex-1 bg-background px-5">
            <View className="gap-4 pt-5">
              <Text className="text text-xl">Ma séance du jour</Text>

              {todayTraining ? (
                <TrainingDay training={todayTraining} />
              ) : (
                <EmptyState
                  title="Aucun entraînement prévu aujourd'hui"
                  buttonText="Modifier mes séances"
                  handlePress={() => router.push("/weeks")}
                />
              )}
            </View>

            <View className="gap-4 pt-6">
              <Text className="text text-xl">Mes objectifs</Text>
              { isGoalsLoading ? (
                <View>
                  <Text className="text mt-4">Chargement de vos objectifs...</Text>
                </View>
              ) : (
                <View>
                  { inProgressGoals.length === 0 ?
                    <EmptyState
                      title="Aucun objectif en cours"
                      buttonText="Ajouter un objectif"
                      handlePress={ () => router.push( "/goal/add-goal" )}
                    />
                    :
                    inProgressGoals.map( ( goal: Goal ) => (
                      <GoalItem key={ goal.$id } goal={ goal }  canDelete={ false } />
                    ))
                  }
                </View>
              )}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}
