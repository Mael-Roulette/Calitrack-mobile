import CustomButton from '@/components/CustomButton'
import React, { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ExerciseForm from './components/ExerciceForm'



const AddExercise = () => {
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );

  return (
    <SafeAreaView edges={ [ 'bottom' ] } className="flex-1 bg-background min-h-full">
      <ExerciseForm />

      <View className='px-5 mb-5'>
        <CustomButton
          title="Ajouter l'exercice"
          
        />
      </View>
    </SafeAreaView>
  )
}

export default AddExercise