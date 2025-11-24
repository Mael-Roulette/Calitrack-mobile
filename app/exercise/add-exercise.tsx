import CustomButton from '@/components/CustomButton'
import React, { useState } from 'react'
import { View, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ExerciseForm from './components/ExerciceForm'
import { createCustomExercise } from '@/lib/exercise.appwrite'
import useExercicesStore from '@/store/exercises.stores'
import { router } from 'expo-router'
import { Exercise } from '@/types'

const AddExercise = () => {
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );
  const { addExercise } = useExercicesStore();
  const [ formData, setFormData ] = useState<Omit<Exercise, "$id">>( {
    name: "",
    description: "",
    difficulty: "",
    type: "",
    format: "hold",
  } );

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
      const newExercise = await createCustomExercise( {
        name: formData.name,
        description: formData.description,
        difficulty: formData.difficulty,
        type: formData.type,
        format: formData.format,
        image: "",
        isCustom: true
      } );

      // Ajouter l'exercice au store
      addExercise( newExercise as any );

      router.back()
    } catch ( error ) {
      console.error( "Erreur lors de la création de l'exercice:", error );
      Alert.alert(
        "Erreur",
        "Impossible de créer l'exercice. Veuillez réessayer."
      );
    } finally {
      setIsSubmitting( false );
    }
  };

  return (
    <SafeAreaView edges={ [ 'bottom' ] } className="flex-1 bg-background min-h-full">
      <ExerciseForm
        formData={ formData }
        setFormData={ setFormData }
      />

      <View className='px-5 mb-5'>
        <CustomButton
          title="Ajouter l'exercice"
          onPress={ handleSubmit }
          isLoading={ isSubmitting }
        />
      </View>
    </SafeAreaView>
  )
}

export default AddExercise