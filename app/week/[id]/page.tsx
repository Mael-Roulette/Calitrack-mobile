import AddTrainingModal from "@/components/trainings/AddTrainingModal";
import PageHeader from "@/components/headers/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { LIMITS } from "@/constants/value";
import useWeeksStore from "@/store/week.store";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const { getWeekById } = useWeeksStore();
  const week = getWeekById(id as string);

  const canAddTraining = (week?.trainings?.length ?? 0) < LIMITS.MAX_TRAININGS;

  return (
    <SafeAreaView className='flex-1 bg-secondary'>
      <View className='flex-1'>
       { week && (
          <>
            <PageHeader
              title={week.name}
              onRightPress={canAddTraining ? () => setModalVisible(true) : undefined}
            />

            <ScrollView className="px-5 bg-background">
              <View className="mt-3 mb-5">
                <Text className="text-lg-custom">
                  Nombre d'entraînement : {week.trainings?.length ?? 0} / {LIMITS.MAX_TRAININGS}
                </Text>
              </View>

              {!week.trainings || week.trainings.length === 0 ? (
                <EmptyState
                  title="Aucun entraînement"
                  buttonText="Ajouter un entraînement"
                  handlePress={() => setModalVisible(true)}
                />
              ) : (
                <View className="flex-col gap-3">
                  {week.trainings.map((training) => (
                    <View key={training} className="flex-row items-center justify-between">
                      <Text className="text-lg font-bold">Texte</Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            <AddTrainingModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              weekId={week.$id}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
