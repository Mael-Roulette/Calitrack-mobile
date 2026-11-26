import ExerciseForm from "@/components/exercises/ExerciseForm";
import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import { useExerciseActions } from "@/hooks/exercise/useExerciseActions";
import { CreateExercise, ExerciseFormat } from "@/types";
import { showAlert } from "@/utils/alert";
import { validators } from "@/utils/validation";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function AddExercise () {
  const { handleCreate, isSubmitting } = useExerciseActions();
  const [ formData, setFormData ] = useState<CreateExercise>( {
    name: "",
    description: "",
    image: "",
    difficulty: "beginner",
    type: "pull",
    format: ExerciseFormat.HOLD
  } );

  const submit = () => {
    if ( !validators.exerciseName( formData.name ) ) {
      return showAlert.error( "Le nom de l'exercice doit contenir entre 3 et 50 caractères" );
    }

    if ( formData.description.trim().length < 10 ) {
      return showAlert.error( "La description doit contenir au moins 10 caractères" );
    }

    if ( !formData.difficulty || !formData.type || !formData.format ) {
      return showAlert.error( "Veuillez remplir tous les champs requis" );
    }

    handleCreate( {
      name: formData.name.trim(),
      description: formData.description.trim(),
      image: formData.image,
      difficulty: formData.difficulty,
      type: formData.type,
      format: formData.format
    } );
  };

  return (
    <View className="flex-1">
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
    </View>
  );
}