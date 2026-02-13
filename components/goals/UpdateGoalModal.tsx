import { Exercise } from "@/types";
import { Modal, Text, View } from "react-native";
import CustomButton from "../ui/CustomButton";
import CustomInput from "../ui/CustomInput";

interface UpdateGoalModalProps {
  modalVisible: boolean;
  setModalVisible: ( value: boolean ) => void;
  exercise: Exercise;
  progress: number;
  newProgress: string;
  setNewProgress: ( value: string ) => void;
  handleUpdateProgress: () => void;
  isUpdating: boolean;
}

export default function UpdateGoalModal ( {
  modalVisible,
  setModalVisible,
  exercise,
  progress,
  newProgress,
  setNewProgress,
  handleUpdateProgress,
  isUpdating
}: UpdateGoalModalProps ) {
  return (
    <Modal
      animationType='slide'
      transparent={ true }
      visible={ modalVisible }
      statusBarTranslucent={ true }
      onRequestClose={ () => setModalVisible( false ) }
    >
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-background w-[80%] p-5 rounded-xl'>
          <Text className='text-xl font-calsans text-primary mb-4'>
            { exercise.name }
          </Text>

          <CustomInput
            label='Ajouter une progression'
            value={ newProgress }
            placeholder={ `${ progress }` }
            keyboardType='numeric'
            onChangeText={ setNewProgress }
          />

          <View className='flex-col gap-2 mt-5'>
            <CustomButton
              title='Annuler'
              onPress={ () => setModalVisible( false ) }
            />

            <CustomButton
              title='Mettre à jour'
              onPress={ handleUpdateProgress }
              isLoading={ isUpdating }
              variant='secondary'
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}