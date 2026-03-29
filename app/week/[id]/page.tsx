import PageHeader from "@/components/headers/PageHeader";
import AddTrainingModal from "@/components/trainings/AddTrainingModal";
import TrainingCard from "@/components/trainings/TrainingCard";
import EmptyState from "@/components/ui/EmptyState";
import { LIMITS } from "@/constants/value";
import useTrainingsStore from "@/store/training.store";
import useWeeksStore from "@/store/week.store";
import { Training } from "@/types";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { id } = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  const { getWeekById } = useWeeksStore();
  const { fetchUserTrainings, getTrainingsByWeekCached } = useTrainingsStore();

  const week = getWeekById(id as string);

  // Charger les données quand la page est focus
  useFocusEffect(() => {
    const loadTrainings = async () => {
      try {
        // Charger toutes les données si nécessaire
        await fetchUserTrainings();

        // Récupérer les entraînements pour cette semaine
        const weekTrainings = getTrainingsByWeekCached(id as string);
        setTrainings(weekTrainings);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
      } finally {
        setLoading(false);
      }
    };

    loadTrainings();
  });

  // Recharger les données quand la page redevient active
  useEffect(() => {
    const loadTrainings = async () => {
      try {
        const weekTrainings = getTrainingsByWeekCached(id as string);
        setTrainings(weekTrainings);
      } catch (error) {
        console.error("Erreur lors du rechargement :", error);
      }
    };

    loadTrainings();
  }, [id]);

  const canAddTraining = trainings.length < LIMITS.MAX_TRAININGS;

  if (loading || !week) {
    return (
      <SafeAreaView className="flex-1 bg-secondary" edges={["bottom"]}>
        <View className="flex-1 justify-center items-center">
          <Text>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary" edges={["bottom"]}>
      <View className="flex-1">
        {week && (
          <>
            <PageHeader
              title={week.name}
              onRightPress={canAddTraining ? () => setModalVisible(true) : undefined}
            />

            <ScrollView className="px-5 bg-background">
              <View className="mt-3 mb-5">
                <Text className="text-lg-custom">
                  Nombre d'entraînements : {trainings.length} / {LIMITS.MAX_TRAININGS}
                </Text>
              </View>

              {trainings.length === 0 ? (
                <EmptyState
                  title="Aucun entraînement"
                  buttonText="Ajouter un entraînement"
                  handlePress={() => setModalVisible(true)}
                />
              ) : (
                <View className="flex-col gap-3 pb-10">
                  {trainings.map((training: Training) => (
                    <TrainingCard
                      key={training.$id}
                      training={training}
                    />
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
