import SimpleHeader from "@/components/headers/SimpleHeader";
import CustomButton from "@/components/ui/CustomButton";
import { router } from "expo-router";
import { ScrollView } from "react-native";
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
        <CustomButton
          title="Voir les mouvements"
          onPress={ () => router.push( "/exercises" ) }
        />
      </ScrollView>
    </SafeAreaView>
  );
}