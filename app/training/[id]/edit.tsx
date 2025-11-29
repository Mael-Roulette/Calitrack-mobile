import { createSeries, deleteSeries } from "@/lib/series.appwrite";
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

      // 1. Supprimer toutes les anciennes séries
      if ( currentTraining.series && currentTraining.series.length > 0 ) {
        for ( const series of currentTraining.series ) {
          await deleteSeries( series.$id );
        }
      }

      // 2. Créer les nouvelles séries avec le bon ordre
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
            rpe: series.rpe,
            note: series.note,
            training: currentTraining.$id,
            order: i + 1, // L'ordre correspond à la position dans la liste
          } );

          // Ajout des séries dans la nouvelle liste
          const newSeries = seriesResponse.series as any as SeriesParams;
          newSeriesList.push( newSeries );
        }
      }

      await updateTraining( {
        id: currentTraining.$id,
        name: form.name,
        days: form.days,
        duration: form.duration,
      } );

      const updatedTraining: Training = {
        $id: currentTraining.$id,
        user: currentTraining.user,
        name: form.name,
        days: form.days,
        duration: form.duration!,
        series: newSeriesList,
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