import ExerciseForm from "@/components/exercises/ExerciseForm";
import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import { useExerciseActions } from "@/hooks/actions/useExerciseActions";
import { getExerciseById } from "@/lib/exercise.appwrite";
import { Exercise } from "@/types";
import { showAlert } from "@/utils/alert";
import { validators } from "@/utils/validation";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditExercise () {
  const { id } = useLocalSearchParams();
  const { handleUpdate, isUpdating } = useExerciseActions();
  const [ exercise, setExercise ] = useState<Exercise>();
  const [ loading, setLoading ] = useState( true );
  const [ formData, setFormData ] = useState<Omit<Exercise, "$id">>( {
    name: "",
    description: "",
    difficulty: "beginner",
    type: "pull",
    format: "hold",
    isCustom: true,
  } );


  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      try {
        const response = await getExerciseById(id as string);
        const exerciseData = response as unknown as Exercise;

        setExercise(exerciseData);

        setFormData( {
          name: exerciseData.name,
          description: exerciseData.description,
          difficulty: exerciseData.difficulty,
          type: exerciseData.type,
          format: exerciseData.format,
          isCustom: exerciseData.isCustom,
        } );
      } catch (error) {
        console.error("Erreur lors de la récupération de l'exercice", error);

        showAlert.error("Impossible de charger l'exercice",() => router.push("/exercises") );
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [ id ]);

  const submit = () => {
    if ( !exercise || !formData ) return;

    if ( !validators.exerciseName( formData.name ) ) {
      return showAlert.error( "Le nom de l'exercice doit contenir entre 3 et 50 caractères" );
    }

    if ( formData.description.trim().length < 10 ) {
      return showAlert.error( "La description doit contenir au moins 10 caractères" );
    }

    if ( !formData.difficulty || !formData.type || !formData.format ) {
      return showAlert.error( "Veuillez remplir tous les champs requis" );
    }

    handleUpdate( {
      $id: exercise.$id,
      name: formData.name.trim(),
      description: formData.description.trim(),
      difficulty: formData.difficulty,
      type: formData.type,
      format: formData.format,
      isCustom: true,
    } );
  };

  return (
    <SafeAreaView className='flex-1 bg-secondary' edges={ [ "bottom" ] }>
      <View className='flex-1 bg-background'>
        { loading ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' color='#0000ff' />
            <Text>Chargement...</Text>
          </View>
        ) : (
          <>
            <PageHeader
              title={ `Modifier : ${ exercise!.name }` }
            />
            <ScrollView>
              <ExerciseForm formData={ formData } setFormData={ setFormData } />
            </ScrollView>
            <View className="px-5 mb-5">
              <CustomButton
                title="Modifier l'exercice"
                onPress={ submit }
                isLoading={ isUpdating }
              />
            </View>
          </>
        ) }
      </View>
    </SafeAreaView>
  );
}