import SimpleHeader from "@/components/headers/SimpleHeader";
import AddWeekModal from "@/components/trainings/week/AddWeekModal";
import WeekItem from "@/components/trainings/week/WeekItem";
import CustomButton from "@/components/ui/CustomButton";
import EmptyState from "@/components/ui/EmptyState";
import useWeeksStore from "@/store/week.store";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalsPage () {
  const [ modalVisible, setModalVisible ] = useState( false );
  const { weeks, isLoading } = useWeeksStore();

  const handleAddPress = () => {
    setModalVisible( true );
  };

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <SimpleHeader
        title="Mes séances"
        subtitle="Vos semaines d'entraînement"
        count={ `${weeks.length}/4` }
        onAddPress={ handleAddPress }
      />

      <ScrollView className="flex-1 bg-background px-5 pt-5">
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FC7942" />
            <Text className="text mt-4">Chargement de vos objectifs...</Text>
          </View>
        ) : (
          <View className="flex-col gap-4">
            {weeks.length === 0 ? (
              <EmptyState
                title="Aucune semaine d'entraînement"
                buttonText="Ajouter une semaine"
                handlePress={ handleAddPress }
              />
            ) : (
              weeks.map( ( week ) => (
                <WeekItem key={ week.$id } week={ week } />
              ) )
            )}
          </View>
        ) }
      </ScrollView>

      <View className="p-5 bg-background">
        <CustomButton
          title="Voir les mouvements"
          onPress={ () => router.push( "/exercises" ) }
        />
      </View>

      <AddWeekModal
        modalVisible={ modalVisible }
        setModalVisible={ setModalVisible }
        nextOrder={ weeks.length + 1 }
      />
    </SafeAreaView>
  );
}
