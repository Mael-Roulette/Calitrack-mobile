import ExercisesSelectionModal from "@/components/exercises/ExercisesSelectionModal";
import PageHeader from "@/components/headers/PageHeader";
import SeriesCard, { SeriesForm } from "@/components/trainings/series/SeriesCard";
import CustomButton from "@/components/ui/CustomButton";
import useTrainingActions from "@/hooks/actions/useTrainingActions";
import { Exercise } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_SERIES_VALUES = {
  sets: 3,
  targetValue: 8,
  rpe: 7,
  weight: null,
  restMinutes: 2,
  restSeconds: 30,
};

export default function AddTrainingStep2 () {
  const params = useLocalSearchParams<{
    weekId: string;
    trainingName: string;
    duration: string;
    days: string;
    note: string;
  }>();

  const [ seriesList, setSeriesList ] = useState<SeriesForm[]>( [] );
  const [ isModalVisible, setIsModalVisible ] = useState( false );
  const { handleCreate, isSubmitting } = useTrainingActions();
  const [ flexToggle, setFlexToggle ] = useState( false );
  const [ showEmptyError, setShowEmptyError ] = useState( false );
  const [ showWeightError, setShowWeightError ] = useState( false );

  useEffect( () => {
    const keyboardShowListener = Keyboard.addListener( "keyboardDidShow", () => {
      setFlexToggle( false );
    } );

    const keyboardHideListener = Keyboard.addListener( "keyboardDidHide", () => {
      setFlexToggle( true );
    } );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, [] );


  const handleExerciseSelected = ( exercises: Exercise[] ) => {
    const exercise = exercises[ 0 ];
    if ( !exercise ) return;

    const newSeries: SeriesForm = {
      ...DEFAULT_SERIES_VALUES,
      exerciseId: exercise.$id,
      exercise,
      order: seriesList.length + 1,
    };

    setSeriesList( ( prev ) => [ ...prev, newSeries ] );
  };

  const handleUpdateSeries = (
    index: number,
    field: keyof SeriesForm,
    value: number | null
  ) => {
    setSeriesList( ( prev ) =>
      prev.map( ( s, i ) => ( i === index ? { ...s, [ field ]: value } : s ) )
    );
  };

  const handleDeleteSeries = ( index: number ) => {
    setSeriesList( ( prev ) =>
      prev
        .filter( ( _, i ) => i !== index )
        .map( ( s, i ) => ( { ...s, order: i + 1 } ) )
    );
  };

  const handleConfirm = async () => {
    if ( seriesList.length === 0 ) {
      setShowEmptyError( true );
      return;
    }

    const hasEmptyWeight = seriesList.some( ( s ) => s.weight === null );
    if ( hasEmptyWeight ) {
      setShowWeightError( true );
      return;
    }

    const seriesData = seriesList.map( ( s ) => ( {
      exerciseId: s.exerciseId,
      sets: s.sets,
      targetValue: s.targetValue,
      rpe: s.rpe,
      weight: s.weight as number,
      restTime: s.restMinutes * 60 + s.restSeconds,
      order: s.order,
    } ) );

    await handleCreate( {
      weekId: params.weekId,
      name: params.trainingName,
      duration: parseInt( params.duration ),
      days: JSON.parse( params.days || "[]" ) as string[],
      note: params.note || undefined,
      series: seriesData,
    } );
  };

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } } edges={ [ "bottom" ] }>
      <PageHeader title={ params.trainingName || "Nouvel entraînement" } />

      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 0 : 0 }
        style={
          flexToggle
            ? [ { flexGrow: 1 } ]
            : [ { flex: 1 } ]
        }
        enabled={ !flexToggle }
      >
        <ScrollView
          className="flex-1 bg-background px-5"
          showsVerticalScrollIndicator={ false }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={ { paddingTop: 20, paddingBottom: 40 } }
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="title-2">
              Mes séries{" "}
              <Text className="text-primary-100 font-sregular text-base">
                ({seriesList.length})
              </Text>
            </Text>
            {seriesList.length > 1 && (
              <TouchableOpacity>
                <Text className="text-secondary font-sregular text-base">
                  Réordonner
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {seriesList.length === 0 && (
            <View className="items-center py-10 border border-dashed border-primary-100/30 rounded-xl mb-4">
              <Text className="label-text text-center text-base mb-1">
                Aucune série ajoutée
              </Text>
              <Text className="label-text text-center text-sm px-6">
                Appuyez sur &quot;Ajouter une série&quot; pour commencer à
                construire votre entraînement
              </Text>
              {showEmptyError && (
                <Text className="text-red-500 font-sregular text-sm mt-3">
                  Veuillez ajouter au moins une série.
                </Text>
              )}
              { showWeightError && (
                <Text className="text-red-500 font-sregular text-sm mt-3 text-center">
                  Veuillez renseigner le poids pour toutes les séries.
                </Text>
              )}
            </View>
          )}

          {seriesList.map( ( series, index ) => (
            <SeriesCard
              key={ `${series.exerciseId}-${index}` }
              series={ series }
              index={ index }
              onUpdate={ handleUpdateSeries }
              onDelete={ handleDeleteSeries }
            />
          ) )}

          <TouchableOpacity
            className="btn-quartenary mt-2 flex-row items-center justify-center gap-2"
            onPress={ () => {
              setShowEmptyError( false );
              setIsModalVisible( true );
            } }
            disabled={ isSubmitting }
          >
            <Text className="text-lg-custom font-bold">+ Ajouter une série</Text>
          </TouchableOpacity>
        </ScrollView>

        <View className="bg-background px-5 py-4 flex-row gap-3 border-t border-primary-100/10">
          <CustomButton
            title="Précédent"
            onPress={ () => router.back() }
            customStyles="flex-1"
            variant="primary"
            isLoading={ isSubmitting }
          />
          <CustomButton
            title="Confirmer"
            onPress={ handleConfirm }
            customStyles="flex-1"
            variant="secondary"
            isLoading={ isSubmitting }
          />
        </View>
      </KeyboardAvoidingView>

      <ExercisesSelectionModal
        isVisible={ isModalVisible }
        onClose={ () => setIsModalVisible( false ) }
        onExerciseSelected={ handleExerciseSelected }
        initialSelectedExercises={ [] }
        selectableExercise={ 1 }
      />
    </SafeAreaView>
  );
}
