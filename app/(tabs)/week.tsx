import SimpleHeader from "@/components/headers/SimpleHeader";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalsPage () {

  return (
    <SafeAreaView  style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <SimpleHeader
        title="Mes séances"
        subtitle="Semaine créées"
        count="1/7"
        onAddPress={ () => {} }
      />
      <ScrollView className="flex-1 bg-background px-5 pt-5">
        <TouchableOpacity className="btn-primary" onPress={ () => router.push( "/exercises" ) }>
          <Text className="text-secondary font-bold text-lg">Voir les mouvements</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}