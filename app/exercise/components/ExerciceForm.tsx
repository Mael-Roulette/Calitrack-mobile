import CustomInput from "@/components/CustomInput";
import CustomSelect from "@/components/CustomSelect";
import { ScrollView, View, Text } from "react-native";
import { exerciseDifficulty, exerciseFormat, exerciseType } from '@/constants/exercises'
import { useState } from "react";

interface FormState {
  name: string;
  description: string;
  difficulty: string;
  type: string;
  format: string;
}

const ExerciseForm = () => {
  const [ form, setForm ] = useState<FormState>( {
    name: "",
    description: "",
    difficulty: "",
    type: "",
    format: "",
  } );

  const handleSubmit = () => {

  }

  return (
    <ScrollView className='mt-2 px-5' contentContainerStyle={ { display: "flex", flexDirection: "column", gap: 15 } }>
      <CustomInput
        label='Nom de l&apos;exercice'
        placeholder='Handstand'
        onChangeText={ ( text: string ) =>
          setForm( ( prev ) => ( { ...prev, name: text } ) )
        }
      />

      <CustomInput
        label="Description"
        placeholder="Equilibre sur les mains"
        multiline={ true }
        numberOfLines={ 5 }
        customStyles="h-32"
        onChangeText={ ( text: string ) =>
          setForm( ( prev ) => ( { ...prev, description: text } ) )
        }
      />
      <View>
        <Text className='font-sregular text-lg text-primary mb-2'>Difficulté</Text>
        <CustomSelect
          options={ exerciseDifficulty }
          value={ form.difficulty }
          onChange={ ( text: string ) =>
            setForm( ( prev ) => ( { ...prev, difficulty: text } ) )
          }
        />
      </View>

      <View>
        <Text className='font-sregular text-lg text-primary mb-2'>Type</Text>
        <CustomSelect
          options={ exerciseType }
          value={ form.type }
          onChange={ ( text: string ) =>
            setForm( ( prev ) => ( { ...prev, type: text } ) )
          }
        />
      </View>

      <View>
        <Text className='font-sregular text-lg text-primary mb-2'>Format</Text>
        <CustomSelect
          options={ exerciseFormat }
          value={ form.format }
          onChange={ ( text: string ) =>
            setForm( ( prev ) => ( { ...prev, format: text } ) )
          }
        />
      </View>
    </ ScrollView>
  )
}

export default ExerciseForm;