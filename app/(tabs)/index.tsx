import HomeHeader from "@/components/headers/HomeHeader";
import TrainingDay from "@/components/trainings/TrainingDay";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage () {
  return (
    <SafeAreaView  style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <HomeHeader
        greeting="Salut Mael !"
        weekInfo="Semaine 1 - Planche"
        onCalendarPress={ () => {} }
      />
      <ScrollView className="flex-1 bg-background px-5">
        <View className="gap-4 pt-5">
          <Text className="text">Ma séance du jour</Text>
          <TrainingDay title="Front lever" duration={ 90 } />
        </View>

        <View className="gap-4 pt-6">
          <Text className="text">Mes objectifs</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}