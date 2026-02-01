import SimpleHeader from "@/components/headers/SimpleHeader";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalsPage () {
  return (
    <SafeAreaView  style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <SimpleHeader
        title="Mes objectifs"
        subtitle="Ajouter une progression en cliquant sur un objectif"
        count="2/4"
        onAddPress={ () => {} }
      />
      <View className="flex-1 bg-background">

      </View>
    </SafeAreaView>
  );
}