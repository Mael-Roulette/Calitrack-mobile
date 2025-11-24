import CustomButton from '@/components/CustomButton'
import { getExerciseById, updateCustomExercise } from '@/lib/exercise.appwrite'
import useExercicesStore from '@/store/exercises.stores'
import { Exercise } from '@/types'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, View, ActivityIndicator, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ExerciseForm from '../components/ExerciceForm'

const EditExercise = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );
  const [ isLoading, setIsLoading ] = useState<boolean>( true );
  const { updateExercise } = useExercicesStore();
  const [ formData, setFormData ] = useState<Omit<Exercise, "$id">>( {
    name: "",
    description: "",
    difficulty: "",
    type: "",
    format: "hold",
  } );

  // Charger les données de l'exercice au montage du composant
  useEffect( () => {
    const loadExercise = async () => {
      if ( !id ) {
        Alert.alert( "Erreur", "ID d'exercice manquant" );
        router.back();
        return;
      }

      try {
        setIsLoading( true );
        const exercise = await getExerciseById( id as string ) as any as Exercise;

        // Remplir le formulaire avec les données de l'exercice
        setFormData( {
          name: exercise.name,
          description: exercise.description,
          difficulty: exercise.difficulty,
          type: exercise.type,
          format: exercise.format,
          image: exercise.image,
          isCustom: exercise.isCustom
        } );
      } catch ( error ) {
        console.error( "Erreur lors du chargement de l'exercice:", error );
        Alert.alert(
          "Erreur",
          "Impossible de charger l'exercice. Veuillez réessayer."
        );
        router.back();
      } finally {
        setIsLoading( false );
      }
    };

    loadExercise();
  }, [ id ] );

  const handleSubmit = async () => {
    // Validation des champs
    if ( !formData.name.trim() ) {
      Alert.alert( "Erreur", "Le nom de l'exercice est requis" );
      return;
    }

    if ( !formData.description.trim() ) {
      Alert.alert( "Erreur", "La description est requise" );
      return;
    }

    if ( !formData.difficulty ) {
      Alert.alert( "Erreur", "Veuillez sélectionner une difficulté" );
      return;
    }

    if ( !formData.type ) {
      Alert.alert( "Erreur", "Veuillez sélectionner un type" );
      return;
    }

    if ( !formData.format ) {
      Alert.alert( "Erreur", "Veuillez sélectionner un format" );
      return;
    }

    setIsSubmitting( true );

    try {
      const updatedExercise = await updateCustomExercise( {
        $id: id as string,
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulty,
        type: formData.type,
        format: formData.format,
        image: formData.image || "",
        isCustom: true
      } );

      // Mettre à jour l'exercice dans le store
      updateExercise( id as string, updatedExercise as any );

      router.push( `/exercise/${id}/` )
    } catch ( error ) {
      console.error( "Erreur lors de la modification de l'exercice:", error );
      Alert.alert(
        "Erreur",
        "Impossible de modifier l'exercice. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting( false );
    }
  };

  // Afficher un loader pendant le chargement
  if ( isLoading ) {
    return (
      <SafeAreaView edges={ [ 'bottom' ] } className="flex-1 bg-background">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FC7942" />
          <Text className="mt-4 text-primary text-lg">Chargement de l&apos;exercice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={ [ 'bottom' ] } className="flex-1 bg-background min-h-full">
      <ExerciseForm
        formData={ formData }
        setFormData={ setFormData }
      />

      <View className='px-5 mb-5'>
        <CustomButton
          title="Modifier l'exercice"
          onPress={ handleSubmit }
          isLoading={ isSubmitting }
        />
      </View>
    </SafeAreaView>
  )
}

export default EditExercise