import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import ExerciseSelectionModal from "@/app/exercise/components/ExerciseSelectionModal";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { Exercise } from "@/types";
import { CreateSeriesParams } from "@/types/series";
import { useMemo, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



const LABEL_CONFIGS = {
  hold: "Temps de hold",
  repetition: "Nombre de répétition",
  default: "Minimum à atteindre",
};

const SeriesFormModal = ( { isVisible, closeModal }: { isVisible: boolean, closeModal: Function } ) => {
  const [ isExerciseModalVisible, setIsExerciseModalVisible ] = useState<boolean>( false );
  const [ selectedExercise, setSelectedExercise ] = useState<Exercise[]>( [] );
  const [ form, setForm ] = useState<CreateSeriesParams>();

  const closeSeriesModal = () => {
    closeModal();
  }

  const handleExerciseModalVisibility = () => {
    setIsExerciseModalVisible( !isExerciseModalVisible );
  }

  const handleExerciseSelection = ( exercises: Exercise[] ) => {
    setSelectedExercise( exercises );
    handleExerciseModalVisibility();
  };

  const labels = useMemo( () => {
    if ( !selectedExercise?.[ 0 ]?.format ) return LABEL_CONFIGS.default;
    return LABEL_CONFIGS[ selectedExercise[ 0 ].format ] || LABEL_CONFIGS.default;
  }, [ selectedExercise ] );

  return (
    <Modal
      statusBarTranslucent={ true }
      visible={ isVisible }
      transparent={ true }
    >
      <SafeAreaView className='flex-1 bg-background'>
        <ScrollView className="px-5 pt-5">
          <Text className="title-2 mb-5">Ajouter une série</Text>
          <View className="flex-col gap-5">
            <View>
              <Text className="font-sregular text-lg text-primary mb-2">Rechercher un exercice</Text>
              <CustomButton
                title="Choisir maintenant"
                variant="secondary"
                onPress={ handleExerciseModalVisibility }
              />
            </View>

            {/* Affichage de l'exercice sélectionné */ }
            { selectedExercise.length > 0 && (
              <View>
                { selectedExercise.map( ( exercise ) => (
                  <ExerciseItem
                    key={ exercise.$id }
                    image={ exercise.image }
                    name={ exercise.name }
                    difficulty={ exercise.difficulty }
                  />
                ) ) }
              </View>
            ) }

            <CustomInput
              label={ labels }
              placeholder="10"
              keyboardType="numeric"
            />

            <CustomInput
              label="Nombre de série"
              placeholder="3"
              keyboardType="numeric"
            />

            <CustomInput
              label="Temps de repos (en minutes)"
              placeholder="3"
              keyboardType="numeric"
            />

            <CustomInput
              label="Note personnelle"
              placeholder="Série de volume..."
              multiline={ true }
              numberOfLines={ 5 }
              customStyles="h-32"
            />
          </View>


        </ScrollView>

        <View className="px-5 pb-5 flex-row gap-5 items-center">
          <CustomButton
            title="Annuler"
            variant="secondary"
            customStyles="flex-1"
            onPress={ () => closeSeriesModal() }
          />
          <CustomButton
            title="Confirmer"
            variant="primary"
            customStyles="flex-1"
          />
        </View>

        <ExerciseSelectionModal
          isVisible={ isExerciseModalVisible }
          onClose={ handleExerciseModalVisibility }
          onExerciseSelected={ handleExerciseSelection }
          initialSelectedExercises={ selectedExercise }
          selectableExercise={ 1 }
        />
      </SafeAreaView>
    </Modal>
  )
}

export default SeriesFormModal;