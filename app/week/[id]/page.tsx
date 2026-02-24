import PageHeader from "@/components/headers/PageHeader";
import SimpleHeader from "@/components/headers/SimpleHeader";
import EmptyState from "@/components/ui/EmptyState";
import { LIMITS } from "@/constants/value";
import useWeeksStore from "@/store/week.store";
import { Week } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState([]);
  const { getWeekById } = useWeeksStore();
  const week = getWeekById(id as string);

  return (
    <SafeAreaView className='flex-1 bg-secondary'>
      <View className='flex-1'>
        {loading ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' color='#0000ff' />
            <Text>Chargement...</Text>
          </View>
        ) : week && (
          <>
            <PageHeader
              title={week.name}
              onRightPress={() => {}}
            />
            <ScrollView className="px-5 bg-background">
              <View className="mt-3 mb-5">
                <Text className="text-lg-custom">Nombre d'entraînement : { week.trainings?.length ?? 0 } / { LIMITS.MAX_TRAININGS }</Text>
              </View>
              { !week.trainings || week.trainings.length === 0 ? (
                <EmptyState
                  title="Aucun entraînement"
                  buttonText="Ajouter un entraînement"
                  handlePress={() => {}}
                />
              ) : (
                <View className="flex-col gap-3">
                  {week.trainings.map((training) => (
                    <View key={training} className="flex-row items-center justify-between">
                      <Text className="text-lg font-bold">Texte</Text>
                    </View>
                  ))}
                </View>
              ) }
            </ScrollView>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
