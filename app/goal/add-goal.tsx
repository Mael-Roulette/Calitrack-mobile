import ExerciseSelectionItem from "@/components/exercises/ExerciseSelectionItem";
import ExercisesSelectionModal from "@/components/exercises/ExercisesSelectionModal";
import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { useGoalLabels } from "@/hooks/useGoalLabels";
import { createGoal } from "@/lib/goal.appwrite";
import { Exercise } from "@/types";
import { showAlert } from "@/utils/alert";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddGoal () {
  const [ isModalVisible, setIsModalVisible ] = useState<boolean>( false );
  const [ selectedExercise, setSelectedExercise ] = useState<Exercise[]>( [] );
  const [ total, setTotal ] = useState<string>( "" );
  const [ progress, setProgress ] = useState<string>( "" );
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const labels = useGoalLabels( selectedExercise[ 0 ] );

  const handleExerciseModalVisibility = () => {
    setIsModalVisible( !isModalVisible );
  };

  const handleExerciseSelection = ( exercises: Exercise[] ) => {
    setSelectedExercise( exercises );
    setIsModalVisible( false );
  };

  const submit = async () => {
    if ( isSubmitting ) return;

    try {
      if ( !selectedExercise.length ) {
        showAlert.error( "Veuillez sélectionner un mouvement." );
        return;
      }

      const parsedTotal = Number( total );
      const parsedProgress = Number( progress );

      if ( isNaN( parsedTotal ) || isNaN( parsedProgress ) || parsedTotal <= 0 || parsedProgress < 0 ) {
        showAlert.error( "Veuillez entrer des valeurs valides." );
        return;
      }

      if ( parsedProgress > parsedTotal ) {
        showAlert.error(
          "La progression ne peut pas être supérieure à l'objectif."
        );
        return;
      }

      setIsSubmitting( true );

      const response = await createGoal( {
        exercise: selectedExercise[ 0 ].$id,
        total: parsedTotal,
        progress: parsedProgress,
      } );

      if ( !response.goal ) {
        showAlert.error( response.message.body );
        return;
      }

      showAlert.success( response.message.body, () => {
        setSelectedExercise( [] );
        setTotal( "" );
        setProgress( "" );
      } );

    } catch ( error ) {
      console.log( error );
      showAlert.error(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue."
      );
    } finally {
      setIsSubmitting( false );
    }
  };


  return (
    <SafeAreaView  style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <PageHeader title="Ajouter un objectif" />
      <View className="flex-1 bg-background">
        <ScrollView className="flex-1 px-5">
          <View className="mt-4">
            <Text className="text mb-4">Sélectionne un mouvement</Text>

            {/* Affichage de l'exercice sélectionné */ }
            { selectedExercise.length > 0 && (
              <View>
                { selectedExercise.map( ( exercise ) => (
                  <ExerciseSelectionItem
                    key={ exercise.$id }
                    image={ exercise.image }
                    name={ exercise.name }
                    difficulty={ exercise.difficulty }
                  />
                ) ) }
              </View>
            ) }

            <CustomButton
              title="Choisir maintenant"
              onPress={ handleExerciseModalVisibility }
            />
          </View>

          <View className="mt-5 gap-5">
            <CustomInput
              label={ labels.total }
              value={ total }
              placeholder="10"
              keyboardType="numeric"
              onChangeText={ setTotal }
            />
            <CustomInput
              label={ labels.progress }
              value={ progress }
              placeholder="2"
              keyboardType="numeric"
              onChangeText={ setProgress }
            />
          </View>

        </ScrollView>

        <View className="px-5 mb-5">
          <CustomButton
            title="Ajouter l'objectif"
            onPress={ submit }
            isLoading={ isSubmitting }
          />
        </View>
      </View>

      <ExercisesSelectionModal
        isVisible={ isModalVisible }
        onClose={ handleExerciseModalVisibility }
        onExerciseSelected={ handleExerciseSelection }
        initialSelectedExercises={ selectedExercise }
        selectableExercise={ 1 }
      />
    </SafeAreaView>
  );
}