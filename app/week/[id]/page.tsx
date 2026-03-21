import PageHeader from "@/components/headers/PageHeader";
import AddTrainingModal from "@/components/trainings/AddTrainingModal";
import TrainingCard from "@/components/trainings/TrainingCard";
import EmptyState from "@/components/ui/EmptyState";
import { LIMITS } from "@/constants/value";
import useWeekTrainings from "@/hooks/useWeekTrainings";
import useWeeksStore from "@/store/week.store";
import { Training } from "@/types";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { id } = useLocalSearchParams();
  const [ modalVisible, setModalVisible ] = useState( false );
  const { getWeekById } = useWeeksStore();
  const week = getWeekById( id as string );

  const { trainings, isLoading, refetch } = useWeekTrainings( id as string );

  const canAddTraining = trainings.length < LIMITS.MAX_TRAININGS;

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <View className="flex-1">
        { week && (
          <>
            <PageHeader
              title={ week.name }
              onRightPress={ canAddTraining ? () => setModalVisible( true ) : undefined }
            />

            <ScrollView className="px-5 bg-background">
              <View className="mt-3 mb-5">
                <Text className="text-lg-custom">
                  Nombre d'entraînements : { trainings.length } / { LIMITS.MAX_TRAININGS }
                </Text>
              </View>

              { isLoading ? (
                <ActivityIndicator className="mt-10" />
              ) : trainings.length === 0 ? (
                <EmptyState
                  title="Aucun entraînement"
                  buttonText="Ajouter un entraînement"
                  handlePress={ () => setModalVisible( true ) }
                />
              ) : (
                <View className="flex-col gap-3 pb-10">
                  { trainings.map( ( training: Training ) => (
                    <TrainingCard
                      key={ training.$id }
                      training={ training }
                    />
                  ) ) }
                </View>
              ) }
            </ScrollView>

            <AddTrainingModal
              modalVisible={ modalVisible }
              setModalVisible={ setModalVisible }
              weekId={ week.$id }
            />
          </>
        ) }
      </View>
    </SafeAreaView>
  );
}