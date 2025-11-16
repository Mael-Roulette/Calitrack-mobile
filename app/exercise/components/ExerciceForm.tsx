import CustomInput from "@/components/CustomInput";
import CustomSelect, { Option } from "@/components/CustomSelect";
import { ScrollView, View, Text } from "react-native";
import { exerciseDifficulty, exerciseType } from '@/constants/exercises'
import { Dispatch } from "react";
import { Exercise } from "@/types";

interface ExerciseFormProps {
  formData: Omit<Exercise, "$id">;
  setFormData: Dispatch<React.SetStateAction<Omit<Exercise, "$id">>>;
}

type ExerciseFormat = "hold" | "repetition";

const exerciseFormat: Option<ExerciseFormat>[] = [
  { label: "Hold", value: "hold" },
  { label: "Repetition", value: "repetition" }
];


const ExerciseForm = ( { formData, setFormData }: ExerciseFormProps ) => {
  return (
    <ScrollView
      className='mt-2 px-5'
      contentContainerStyle={ { display: "flex", flexDirection: "column", gap: 15 } }
      showsVerticalScrollIndicator={ false }
    >
      <CustomInput
        label='Nom de l&apos;exercice'
        placeholder='Handstand'
        value={ formData.name }
        onChangeText={ ( text: string ) =>
          setFormData( ( prev ) => ( { ...prev, name: text } ) )
        }
      />

      <CustomInput
        label="Description"
        placeholder="Equilibre sur les mains"
        value={ formData.description }
        multiline={ true }
        numberOfLines={ 5 }
        customStyles="h-32"
        onChangeText={ ( text: string ) =>
          setFormData( ( prev ) => ( { ...prev, description: text } ) )
        }
      />

      <View>
        <Text className='font-sregular text-lg text-primary mb-2'>Difficulté</Text>
        <CustomSelect
          options={ exerciseDifficulty }
          value={ formData.difficulty }
          onChange={ ( text: string ) =>
            setFormData( ( prev ) => ( { ...prev, difficulty: text } ) )
          }
        />
      </View>

      <View>
        <Text className='font-sregular text-lg text-primary mb-2'>Type</Text>
        <CustomSelect
          options={ exerciseType }
          value={ formData.type }
          onChange={ ( text: string ) =>
            setFormData( ( prev ) => ( { ...prev, type: text } ) )
          }
        />
      </View>

      <View>
        <Text className='font-sregular text-lg text-primary mb-2'>Format</Text>
        <CustomSelect<ExerciseFormat>
          options={ exerciseFormat }
          value={ formData.format }
          onChange={ ( text ) =>
            setFormData( ( prev ) => ( { ...prev, format: text } ) )
          }
        />
      </View>
    </ScrollView>
  )
}

export default ExerciseForm;