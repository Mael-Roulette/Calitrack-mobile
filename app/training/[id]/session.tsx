import PageHeader from "@/components/headers/PageHeader";
import { Text, View } from "react-native";

export default function SessionPage () {
  const handleQuitTraining = () => {
    console.log( "quit" );
    // Ajouter popup de confirmation
  };

  return (
    <View className="flex-1">
      <PageHeader
        title="Session"
        onBackPress={ handleQuitTraining }
      />
      <Text>Progression de l&apos;entraînement (1/3)</Text>
    </View>
  );
}