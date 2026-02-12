import ExerciseSelectionItem from "@/components/exercises/ExerciseSelectionItem";
import ExercisesSelectionModal from "@/components/exercises/ExercisesSelectionModal";
import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { useGoalLabels } from "@/hooks/useGoalLabels";
import { Exercise } from "@/types";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddGoal () {
  const [ isModalVisible, setIsModalVisible ] = useState<boolean>( false );
  const [ selectedExercise, setSelectedExercise ] = useState<Exercise[]>( [] );
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const labels = useGoalLabels( selectedExercise[ 0 ] );

  const handleExerciseModalVisibility = () => {
    setIsModalVisible( !isModalVisible );
  };

  const handleExerciseSelection = ( exercises: Exercise[] ) => {
    setSelectedExercise( exercises );
    setIsModalVisible( false );
  };

  const submit = () => {

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
              value={ "0" }
              placeholder="10"
              keyboardType="numeric"
              onChangeText={ ( value ) => {} }
            />
            <CustomInput
              label={ labels.progress }
              value={ "0" }
              placeholder="2"
              keyboardType="numeric"
              onChangeText={ ( value ) => {} }
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