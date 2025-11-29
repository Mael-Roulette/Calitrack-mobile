import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import ExerciseSelectionModal from "@/app/exercise/components/ExerciseSelectionModal";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomTimePicker from "@/components/CustomTimePicker";
import { getExerciseById } from "@/lib/exercise.appwrite";
import { Exercise } from "@/types";
import { CreateSeriesParams } from "@/types/series";
import { useEffect, useMemo, useState } from "react";
import { Alert, Modal, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MixSeriesType } from "./TrainingForm";
import RpeSelector from "./RpeSelector";

const LABEL_CONFIGS = {
  hold: "Temps de hold",
  repetition: "Nombre de répétition",
  default: "Valeur à atteindre",
};

interface SeriesFormModalProps {
  isVisible: boolean;
  closeModal: () => void;
  onSeriesCreated: ( series: MixSeriesType ) => void;
  editingSeries?: MixSeriesType | null;
  editingIndex?: number | null;
  onSeriesUpdated?: ( series: MixSeriesType, index: number ) => void;
}

const SeriesFormModal = ( {
  isVisible,
  closeModal,
  onSeriesCreated,
  editingSeries,
  editingIndex,
  onSeriesUpdated
}: SeriesFormModalProps ) => {
  const [ isExerciseModalVisible, setIsExerciseModalVisible ] = useState<boolean>( false );
  const [ selectedExercise, setSelectedExercise ] = useState<Exercise[]>( [] );
  const [ form, setForm ] = useState( {
    targetValue: "",
    sets: "",
    restTime: 0,
    rpe: 5,
    note: "",
  } );

  // Charger les données d'édition
  useEffect( () => {
    const loadEditingData = async () => {
      if ( editingSeries && isVisible ) {
        try {
          const exercise = await getExerciseById( typeof editingSeries.exercise === 'string' ? editingSeries.exercise : editingSeries.exercise.$id ) as any as Exercise;
          setSelectedExercise( [ exercise ] );
          setForm( {
            targetValue: editingSeries.targetValue.toString(),
            sets: editingSeries.sets.toString(),
            restTime: editingSeries.restTime || 0,
            rpe: editingSeries.rpe,
            note: editingSeries.note || "",
          } );
        } catch ( error ) {
          console.error( "Erreur lors du chargement de l'exercice", error );
        }
      }
    };
    loadEditingData();
  }, [ editingSeries, isVisible ] );

  const resetForm = () => {
    setSelectedExercise( [] );
    setForm( {
      targetValue: "",
      sets: "",
      restTime: 0,
      rpe: 5,
      note: "",
    } );
  };

  const closeSeriesModal = () => {
    resetForm();
    closeModal();
  }

  const handleExerciseModalVisibility = () => {
    setIsExerciseModalVisible( !isExerciseModalVisible );
  }

  const handleExerciseSelection = ( exercises: Exercise[] ) => {
    setSelectedExercise( exercises );
    handleExerciseModalVisibility();
  };

  const handleConfirm = () => {
    // Validation du formulaire
    if ( !form ) return;

    if ( selectedExercise.length === 0 ) {
      Alert.alert( "Erreur", "Veuillez sélectionner un exercice" );
      return;
    }

    const targetValue = parseInt( form.targetValue );
    const sets = parseInt( form.sets );
    const restTime = form.restTime ? form.restTime : undefined;
    const rpe = form.rpe;

    if ( !form.targetValue || !form.sets ) {
      Alert.alert( "Erreur", "Veuillez remplir la valeur cible et le nombre de séries" );
      return;
    }

    if ( targetValue <= 0 ) {
      Alert.alert( "Erreur", "La valeur cible doit être un nombre positif" );
      return;
    }

    if ( sets <= 0 ) {
      Alert.alert( "Erreur", "Le nombre de séries doit être un nombre positif" );
      return;
    }

    if ( restTime && restTime < 0 ) {
      Alert.alert( "Erreur", "Le temps de repos doit être un nombre positif" );
      return;
    }

    const newSeries: Omit<CreateSeriesParams, 'training' | 'order'> = {
      exercise: selectedExercise[ 0 ].$id,
      targetValue: targetValue,
      sets: sets,
      restTime: restTime,
      rpe: rpe,
      note: form.note
    }

    // Si on édite, appeler onSeriesUpdated, sinon onSeriesCreated
    if ( editingSeries && editingIndex !== null && editingIndex !== undefined && onSeriesUpdated ) {
      onSeriesUpdated( newSeries, editingIndex );
    } else {
      onSeriesCreated( newSeries );
    }

    resetForm();
    closeSeriesModal();
  }

  const labels = useMemo( () => {
    if ( !selectedExercise?.[ 0 ]?.format ) return LABEL_CONFIGS.default;
    return LABEL_CONFIGS[ selectedExercise[ 0 ].format ] || LABEL_CONFIGS.default;
  }, [ selectedExercise ] );

  const isEditing = editingSeries !== null && editingSeries !== undefined;

  return (
    <Modal
      statusBarTranslucent={ true }
      visible={ isVisible }
      transparent={ true }
      animationType="fade"
    >
      <SafeAreaView className='flex-1 bg-black/40' edges={ [ 'bottom' ] }>
        <View className="h-full bg-background pt-8">
          <ScrollView className="px-5 pt-5">
            <Text className="title-2 mb-5">
              { isEditing ? "Modifier la série" : "Ajouter une série" }
            </Text>
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
                value={ form.targetValue }
                onChangeText={ ( text ) => setForm( prev => ( { ...prev, targetValue: text } ) ) }
                keyboardType="numeric"
              />

              <CustomInput
                label="Nombre de série"
                placeholder="3"
                value={ form.sets }
                onChangeText={ ( text ) => setForm( prev => ( { ...prev, sets: text } ) ) }
                keyboardType="numeric"
              />

              <CustomTimePicker
                label="Temps de repos (en minutes)"
                value={ form.restTime }
                showHours={ false }
                onChange={ ( number ) => setForm( prev => ( { ...prev, restTime: number } ) ) }
              />

              <View className='w-full gap-1'>
                <Text className='font-sregular text-lg text-primary'>Effort perçu (RPE)</Text>
                <RpeSelector
                  value={form.rpe}
                  onChange={(value) => setForm(prev => ({ ...prev, rpe: value }))}
                />
              </View>

              <CustomInput
                label="Note personnelle (optionnelle)"
                placeholder="Série de volume..."
                value={ form.note }
                onChangeText={ ( text ) => setForm( prev => ( { ...prev, note: text } ) ) }
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
              onPress={ closeSeriesModal }
            />
            <CustomButton
              title={ isEditing ? "Mettre à jour" : "Confirmer" }
              variant="primary"
              customStyles="flex-1"
              onPress={ handleConfirm }
            />
          </View>
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