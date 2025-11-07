import { createSeries, deleteSeries, updateSeries } from "@/lib/series.appwrite";
import { updateTraining } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import { createTrainingParams, Training } from "@/types";
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

      // Gestion des séries
      const existingSeries = currentTraining.series || [];
      const existingSeriesIds = existingSeries.map( ( s ) => s.$id );

      let updatedSeriesList: SeriesParams[] = [];

      // Parcourir la nouvelle liste de séries
      for ( let i = 0; i < seriesList.length; i++ ) {
        const series = seriesList[ i ];

        // Extraction de l'exerciceId
        const exerciseId =
          typeof series.exercise === "string"
            ? series.exercise
            : series.exercise.$id;

        // Vérifier si la série existe déjà (a un $id)
        if ( "$id" in series && series.$id ) {
          // Mise à jour d'une série existante
          const updatedSeries = await updateSeries( {
            $id: series.$id,
            exercise: exerciseId,
            targetValue: series.targetValue,
            sets: series.sets,
            restTime: series.restTime,
            note: series.note,
            order: i + 1,
          } );

          updatedSeriesList.push( updatedSeries.series as any as SeriesParams );
        } else {
          // Création d'une nouvelle série
          const newSeries = await createSeries( {
            exercise: exerciseId,
            targetValue: series.targetValue,
            sets: series.sets,
            restTime: series.restTime,
            note: series.note,
            training: currentTraining.$id,
            order: i + 1,
          } );

          updatedSeriesList.push( newSeries.series as any as SeriesParams );
        }
      }

      // Supprimer les séries qui ont été retirées
      const newSeriesIds = seriesList
        .filter( ( s ) => "$id" in s && s.$id )
        .map( ( s ) => ( "$id" in s ? s.$id : "" ) );

      const seriesToDelete = existingSeriesIds.filter(
        ( id ) => !newSeriesIds.includes( id )
      );

      for ( const seriesId of seriesToDelete ) {
        await deleteSeries( seriesId );
      }

      // Mise à jour du store local
      const updatedTraining: Training = {
        $id: currentTraining.$id,
        user: currentTraining.user,
        name: form.name,
        days: form.days,
        duration: form.duration!,
        series: updatedSeriesList,
      };

      updateTrainingStore( currentTraining.$id, updatedTraining );
      router.back();
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