import ExercisesSelectionModal from "@/components/exercises/ExercisesSelectionModal";
import PageHeader from "@/components/headers/PageHeader";
import SeriesCard, { SeriesForm } from "@/components/trainings/series/SeriesCard";
import CustomButton from "@/components/ui/CustomButton";
import { Exercise } from "@/types";
import { showAlert } from "@/utils/alert";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Valeurs par défaut d'une nouvelle série
const DEFAULT_SERIES_VALUES = {
  sets: 3,
  targetValue: 8, // 8 reps ou 8 secondes
  rpe: 7,
  weight: 0,
  restMinutes: 2,
  restSeconds: 30,
};

export default function AddTrainingStep2 () {
  const params = useLocalSearchParams<{
    weekId: string;
    trainingName: string;
    duration: string;   // en minutes (string)
    days: string;       // JSON.stringify(string[])
    note: string;
  }>();

  const [ seriesList, setSeriesList ] = useState<SeriesForm[]>( [] );
  const [ isModalVisible, setIsModalVisible ] = useState( false );
  const [ isSubmitting, setIsSubmitting ] = useState( false );

  // Ajouter une série après sélection d'exercice
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

  // Mettre à jour un champ numérique d'une série
  const handleUpdateSeries = (
    index: number,
    field: keyof SeriesForm,
    value: number
  ) => {
    setSeriesList( ( prev ) =>
      prev.map( ( s, i ) => ( i === index ? { ...s, [ field ]: value } : s ) )
    );
  };

  // Supprimer une série et recalculer les ordres
  const handleDeleteSeries = ( index: number ) => {
    setSeriesList( ( prev ) =>
      prev
        .filter( ( _, i ) => i !== index )
        .map( ( s, i ) => ( { ...s, order: i + 1 } ) )
    );
  };

  const handleConfirm = async () => {
    if ( seriesList.length === 0 ) {
      showAlert.error( "Veuillez ajouter au moins une série." );
      return;
    }

    setIsSubmitting( true );

    try {
      // Construire les données conformes au type Training + Series
      // Series.restTime est en secondes (restMinutes * 60 + restSeconds)
      const seriesData = seriesList.map( ( s ) => ( {
        exerciseId: s.exerciseId,
        sets: s.sets,
        targetValue: s.targetValue,
        rpe: s.rpe,
        weight: s.weight,
        restTime: s.restMinutes * 60 + s.restSeconds,
        order: s.order,
      } ) );

      const trainingData = {
        week: params.weekId,                            // Training.week = string (id)
        name: params.trainingName,
        duration: parseInt( params.duration ),            // Training.duration = number (minutes)
        days: JSON.parse( params.days || "[]" ) as string[],  // Training.days = string[]
        note: params.note || undefined,
        series: seriesData,
      };

      // TODO: remplacer par createTraining(user, trainingData)
      console.log( "Training à créer :", trainingData );

      showAlert.success( "Entraînement créé avec succès !", () => {
        router.replace( `/week/${params.weekId}/page` );
      } );
    } catch ( error ) {
      showAlert.error(
        error instanceof Error ? error.message : "Une erreur est survenue."
      );
    } finally {
      setIsSubmitting( false );
    }
  };

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <PageHeader title={ params.trainingName || "Nom de l'entrainement" } />

      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ { flex: 1 } }
      >
        <ScrollView
          className="flex-1 bg-background px-5"
          showsVerticalScrollIndicator={ false }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={ { paddingTop: 20, paddingBottom: 40 } }
        >
          {/* En-tête de la liste */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="title-2">
              Mes séries ({seriesList.length})
            </Text>
            {seriesList.length > 1 && (
              <TouchableOpacity>
                <Text className="text-secondary font-sregular text-base">
                  Changer l&apos;ordre
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* État vide */}
          {seriesList.length === 0 && (
            <View className="items-center py-10">
              <Text className="label-text text-center mb-1">
                Aucune série ajoutée
              </Text>
              <Text className="label-text text-center text-sm">
                Appuyez sur &quot;Ajouter une série&quot; pour commencer
              </Text>
            </View>
          )}

          {/* Liste des SeriesCard */}
          {seriesList.map( ( series, index ) => (
            <SeriesCard
              key={ `${series.exerciseId}-${index}` }
              series={ series }
              index={ index }
              onUpdate={ handleUpdateSeries }
              onDelete={ handleDeleteSeries }
            />
          ) )}

          {/* Bouton ajouter */}
          <TouchableOpacity
            className="btn-quartenary mt-2"
            onPress={ () => setIsModalVisible( true ) }
          >
            <Text className="text-lg-custom font-bold">Ajouter une série</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Boutons de navigation */}
        <View className="bg-background px-5 py-4 flex-row gap-3 border-t border-primary-100/10">
          <CustomButton
            title="Précédent"
            onPress={ () => router.back() }
            customStyles="flex-1"
            variant="primary"
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

      {/* Modal de sélection d'exercice */}
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
