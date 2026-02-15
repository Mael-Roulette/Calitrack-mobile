import ExerciseForm from "@/components/exercises/ExerciseForm";
import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import { useExerciseActions } from "@/hooks/actions/useExerciseActions";
import { Exercise } from "@/types";
import { showAlert } from "@/utils/alert";
import { validators } from "@/utils/validation";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddExercise () {
  const { handleCreate, isSubmitting } = useExerciseActions();
  const [ formData, setFormData ] = useState<Omit<Exercise, "$id">>( {
    name: "",
    description: "",
    difficulty: "beginner",
    type: "pull",
    format: "hold",
    isCustom: true,
  } );

  const submit = () => {
    // Validation du nom
    if ( !validators.exerciseName( formData.name ) ) {
      return showAlert.error( "Le nom de l'exercice doit contenir entre 3 et 50 caractères" );
    }

    // Validation de la description
    if ( formData.description.trim().length < 10 ) {
      return showAlert.error( "La description doit contenir au moins 10 caractères" );
    }

    // Validation des champs requis
    if ( !formData.difficulty || !formData.type || !formData.format ) {
      return showAlert.error( "Veuillez remplir tous les champs requis" );
    }

    // Appel de l'action de création
    handleCreate( {
      name: formData.name.trim(),
      description: formData.description.trim(),
      difficulty: formData.difficulty,
      type: formData.type,
      format: formData.format,
      isCustom: true,
    } );
  };

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <PageHeader title="Ajouter un exercice" />
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1">
          <ExerciseForm formData={ formData } setFormData={ setFormData } />
        </ScrollView>

        <View className="px-5 mb-5">
          <CustomButton
            title="Ajouter l'exercice"
            onPress={ submit }
            isLoading={ isSubmitting }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}