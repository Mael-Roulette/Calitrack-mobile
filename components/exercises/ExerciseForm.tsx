import CustomSelect from "@/components/ui/CustomSelect";
import {
  DIFFICULTY_OPTIONS,
  EXERCISE_FORMAT_OPTIONS,
  EXERCISE_TYPE_OPTIONS
} from "@/constants/exercises";
import { Exercise } from "@/types";
import { Dispatch } from "react";
import { ScrollView, Text, View } from "react-native";
import CustomInput from "../ui/CustomInput";

interface ExerciseFormProps {
  formData: Omit<Exercise, "$id">;
  setFormData: Dispatch<React.SetStateAction<Omit<Exercise, "$id">>>;
}

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
          options={ DIFFICULTY_OPTIONS }
          value={ formData.difficulty }
          onChange={ ( text: string ) =>
            setFormData( ( prev ) => ( { ...prev, difficulty: text } ) )
          }
        />
      </View>

      <View>
        <Text className='font-sregular text-lg text-primary mb-2'>Type</Text>
        <CustomSelect
          options={ EXERCISE_TYPE_OPTIONS }
          value={ formData.type }
          onChange={ ( text: string ) =>
            setFormData( ( prev ) => ( { ...prev, type: text } ) )
          }
        />
      </View>

      <View>
        <Text className='font-sregular text-lg text-primary mb-2'>Format</Text>
        <CustomSelect
          options={ EXERCISE_FORMAT_OPTIONS }
          value={ formData.format }
          onChange={ ( text: "hold" | "repetition" ) =>
            setFormData( ( prev ) => ( { ...prev, format: text } ) )
          }
        />
      </View>
    </ScrollView>
  );
};

export default ExerciseForm;