import CustomSelect from "@/components/ui/CustomSelect";
import {
  DIFFICULTY_OPTIONS,
  EXERCISE_FORMAT_OPTIONS,
  EXERCISE_TYPE_OPTIONS
} from "@/constants/exercises";
import { createFile } from "@/lib/bucket.appwrite";
import { useAuthStore } from "@/store";
import { Exercise } from "@/types";
import { showAlert } from "@/utils/alert";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Dispatch } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomInput from "../ui/CustomInput";

interface ExerciseFormProps {
  formData: Omit<Exercise, "$id">;
  setFormData: Dispatch<React.SetStateAction<Omit<Exercise, "$id">>>;
}

const ExerciseForm = ( { formData, setFormData }: ExerciseFormProps ) => {
  const { user } = useAuthStore();

  const handlePickExoPicture = async () => {
    const result = await ImagePicker.launchImageLibraryAsync( {
      mediaTypes: [ "images" ],
      allowsEditing: true,
      quality: 0.7,
      aspect: [ 4, 3 ],
    } );
    if ( result.canceled ) return;

    try {
      const createdFile = await createFile( { image: result.assets[ 0 ], type: "exercise", user: user! } );
      setFormData( ( prev ) => ( { ...prev, image: createdFile.fileUrl } ) );
    } catch ( err ) {
      console.error( "Upload failed:", err );
      showAlert.error( "Impossible de mettre à jour la photo" );
    }
  };

  return (
    <ScrollView
      className='mt-2 px-5'
      contentContainerStyle={ { display: "flex", flexDirection: "column", gap: 15 } }
      showsVerticalScrollIndicator={ false }
    >
      <TouchableOpacity className='relative overflow-hidden bg-secondary mt-5 rounded-md h-60 w-full items-center justify-center' onPress={ () => handlePickExoPicture() }>
        { formData.image ?
          <>
            <Image
              source={ formData.image }
              style={ {
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
              } }
              contentFit="cover"
              contentPosition="center"
            />
            <View className="rounded-full p-2 aspect-square border border-primary bg-background absolute top-2 right-2">
              <MaterialIcons name="add-photo-alternate" size={ 24 } className="text-primary" />
            </View>
          </>
          :
          <View className="rounded-full p-2 aspect-square bg-background">
            <MaterialIcons name="add-photo-alternate" size={ 24 } className="text-primary" />
          </View>
        }
      </TouchableOpacity>

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
        placeholder="Équilibre sur les mains"
        value={ formData.description }
        multiline={ true }
        numberOfLines={ 5 }
        customStyles="h-32"
        onChangeText={ ( text: string ) =>
          setFormData( ( prev ) => ( { ...prev, description: text } ) )
        }
      />

      <View>
        <Text className='label-text mb-2'>Difficulté</Text>
        <CustomSelect
          options={ DIFFICULTY_OPTIONS }
          value={ formData.difficulty }
          onChange={ ( text: string ) =>
            setFormData( ( prev ) => ( { ...prev, difficulty: text } ) )
          }
        />
      </View>

      <View>
        <Text className='label-text mb-2'>Type</Text>
        <CustomSelect
          options={ EXERCISE_TYPE_OPTIONS }
          value={ formData.type }
          onChange={ ( text: string ) =>
            setFormData( ( prev ) => ( { ...prev, type: text } ) )
          }
        />
      </View>

      <View>
        <Text className='label-text mb-2'>Format</Text>
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