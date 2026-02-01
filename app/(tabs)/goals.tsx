import SimpleHeader from "@/components/headers/SimpleHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalsPage () {
  return (
    <SafeAreaView>
      <SimpleHeader
        title="Mes objectifs"
        subtitle="Ajouter une progression en cliquant sur un objectif"
        count="2/4"
        onAddPress={ () => {} }
      />
    </SafeAreaView>
  );
}