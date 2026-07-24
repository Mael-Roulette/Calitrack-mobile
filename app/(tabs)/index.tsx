import GoalItem from "@/components/goals/GoalItem";
import HomeHeader from "@/components/headers/HomeHeader";
import TrainingDay from "@/components/trainings/TrainingDay";
import EmptyState from "@/components/ui/EmptyState";
import PrimaryGradient from "@/components/ui/PrimaryGradient";
import { useTodayTraining, useTrainingDoneToday } from "@/hooks/useTodayTraining";
import { useAuthStore, useExercicesStore, useGoalsStore } from "@/store";
import useSessionsStore from "@/store/session.store";
import useTrainingsStore from "@/store/training.store";
import useWeeksStore from "@/store/week.store";
import { Goal } from "@/types";
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

export default function HomePage () {
  const { user, isLoading } = useAuthStore();
  const { fetchUserGoals, getActiveGoals, isLoading: isGoalsLoading } = useGoalsStore();
  const { fetchExercises } = useExercicesStore();
  const { fetchUserWeeks } = useWeeksStore();
  const { fetchUserTrainings } = useTrainingsStore();
  const { fetchUserSessions } = useSessionsStore();
  const todayTraining = useTodayTraining();
  const isTrainingDone = useTrainingDoneToday();

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
    fetchUserSessions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ user ] );

  const inProgressGoals = getActiveGoals();

  return (
    <View className="flex-1">
      { ( isLoading || !user ) ? (
        <View>
          <Text className='title'>Chargement...</Text>
        </View>
      ) : (
        <>
          <HomeHeader
            greeting={ `Salut ${user.name}` }
            onCalendarPress={ () => router.push( "/planning" ) }
          />

          <ScrollView className="flex-1 bg-background px-5">
            <View className="gap-4 pt-5">
              <Text className="text text-xl">Ma séance du jour</Text>

              { !todayTraining ? (
                <EmptyState
                  title="Aucun entraînement prévu aujourd'hui"
                  buttonText="Modifier mes séances"
                  handlePress={ () => router.push( "/weeks" ) }
                />
              ) : ( ( todayTraining && isTrainingDone ) ? (
                <PrimaryGradient>
                  <View className="p-5">
                    <Text className="text-lg-custom text-background">L&apos;entraînement du jour a déjà été fait.</Text>
                  </View>
                </PrimaryGradient>
              ) : (
                <TrainingDay training={ todayTraining } />
              ) )}
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
                      handlePress={ () => router.push( "/goal/add-goal" ) }
                    />
                    :
                    inProgressGoals.map( ( goal: Goal ) => (
                      <GoalItem key={ goal.$id } goal={ goal }  canDelete={ false } />
                    ) )
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
