import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import { useExerciseActions } from "@/hooks/actions/useExerciseActions";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddExercise () {
  const { handleCreate, isSubmitting } = useExerciseActions();

  const submit = () => {

  };

  return (
    <SafeAreaView  style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <PageHeader title="Ajouter un exercice" />
      <View className="flex-1 bg-background">

        <View className="px-5 mb-5">
          <CustomButton
            title="Ajouter l'objectif"
            onPress={ submit }
            isLoading={ isSubmitting }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}