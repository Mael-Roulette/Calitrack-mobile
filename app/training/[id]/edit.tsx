import { createSeries } from "@/lib/series.appwrite";
import { updateTraining } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import { Training, createTrainingParams } from "@/types";
import { SeriesParams } from "@/types/series";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import TrainingForm, { MixSeriesType } from "../components/TrainingForm";

const EditTrainingPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );

  // Récupération du training depuis le store
  const { getById, updateTrainingStore } = useTrainingsStore();
  const training = getById( id );

  if ( !training ) {
    return router.push( '/(tabs)/trainings' );
  }

  // À ce stade, TypeScript sait que training n'est pas null
  const currentTraining: Training = training;

  // Fonction de mise à jour de l'entraînement
  const handleUpdate = async ( {
    form,
    seriesList,
  }: {
    form: Partial<createTrainingParams>;
    seriesList: MixSeriesType[];
  } ): Promise<void> => {
    // Vérification des champs obligatoires
    if ( !form.name || !form.days || form.days.length === 0 ) {
      Alert.alert( "Erreur", "Veuillez remplir tous les champs obligatoires" );
      return;
    }

    try {
      setIsSubmitting( true );

      // Mise à jour des informations de base du training
      await updateTraining( {
        id: currentTraining.$id,
        name: form.name,
        days: form.days,
        duration: form.duration,
      } );

      // Création des séries (s'ajoute automatiquement dans les entrainements)
      let newSeriesList: SeriesParams[] = [];
      if ( seriesList.length > 0 ) {
        for ( let i = 0; i < seriesList.length; i++ ) {
          const series = seriesList[ i ];

          // Extraction de l'exerciseId selon le type de série
          const exerciseId = typeof series.exercise === 'string'
            ? series.exercise
            : series.exercise.$id;

          const seriesResponse = await createSeries( {
            exercise: exerciseId,
            targetValue: series.targetValue,
            sets: series.sets,
            restTime: series.restTime,
            note: series.note,
            training:
              "training" in series && series.training
                ? series.training
                : training.$id,
            order:
              "order" in series && series.order
                ? series.order
                : i + 1,
          } );

          // Ajout des séries dans le store
          const newSeries = seriesResponse.series as any as SeriesParams;
          newSeriesList.push( newSeries );
        }
      }

      // Mise à jour du store local
      const updatedTraining: Training = {
        $id: currentTraining.$id,
        user: currentTraining.user,
        name: form.name,
        days: form.days,
        duration: form.duration!,
        // series: updatedSeriesList,
      };

      updateTrainingStore( currentTraining.$id, updatedTraining );
      router.push( `/training/${id}/` );
    } catch ( err ) {
      console.error( "Erreur lors de la modification de l'entraînement:", err );
      Alert.alert( "Erreur", "Échec de la modification. Réessayez." );
    } finally {
      setIsSubmitting( false );
    }
  };

  return (
    <View className="flex-1 bg-background min-h-full px-5">
      <TrainingForm
        initialData={ currentTraining }
        onSubmit={ handleUpdate }
        submitButtonText="Modifier l'entraînement"
        isSubmitting={ isSubmitting }
      />
    </View>
  );
};

export default EditTrainingPage;