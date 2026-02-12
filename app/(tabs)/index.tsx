import HomeHeader from "@/components/headers/HomeHeader";
import EmptyState from "@/components/ui/EmptyState";
import { useAuthStore, useExercicesStore } from "@/store";
import { router } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage () {
  const { user, isLoading } = useAuthStore();
  const { fetchExercises } = useExercicesStore();

  useEffect( () => {
    if ( !isLoading && !user ) {
      router.replace( "/(auth)" );
    }
  }, [ user, isLoading ] );

  useEffect( () => {
    fetchExercises();
  }, [ fetchExercises, user ] );

  return (
    <SafeAreaView  style={ { flex: 1, backgroundColor: "#FC7942" } }>
      { isLoading ? (
				<View>
					<Text className='title'>Chargement...</Text>
				</View>
			) : (
        <>
          <HomeHeader
            greeting={ `Salut ${user?.name}`}
            weekInfo="Semaine 1 - Planche"
            onCalendarPress={ () => {} }
          />
          
          <ScrollView className="flex-1 bg-background px-5">
            <View className="gap-4 pt-5">
              <Text className="text">Ma séance du jour</Text>
              <EmptyState
                title="Aucun entrainement prévu aujourd'hui"
                buttonText="Modifier mes séances"
                handlePress={ () => router.push( "/(tabs)/week" )}
              />
            </View>

            <View className="gap-4 pt-6">
              <Text className="text">Mes objectifs</Text>
              <EmptyState
                title="Aucun objectif en cours"
                buttonText="Ajouter un objectif"
                handlePress={ () => router.push( "/(tabs)/goals" )}
              />
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
}