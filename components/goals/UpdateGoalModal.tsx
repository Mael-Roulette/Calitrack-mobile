import { Exercise } from "@/types";
import { memo } from "react";
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

function UpdateGoalModal ( {
  modalVisible,
  setModalVisible,
  exercise,
  progress,
  newProgress,
  setNewProgress,
  handleUpdateProgress,
  isUpdating
}: UpdateGoalModalProps ) {

  const handleClose = () => {
    if ( !isUpdating ) {
      setModalVisible( false );
    }
  };

  return (
    <Modal
      animationType='fade'
      transparent={ true }
      visible={ modalVisible }
      statusBarTranslucent={ true }
      onRequestClose={ handleClose }
    >
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-background w-[85%] p-6 rounded-xl'>
          <Text className='text-2xl font-calsans text-primary mb-2'>
            { exercise.name }
          </Text>

          <Text className='indicator-text text-lg mb-4'>
            Progression actuelle : { progress }
          </Text>

          <CustomInput
            label='Nouvelle progression'
            value={ newProgress }
            placeholder={ `Ex: ${ progress + 1 }` }
            keyboardType='numeric'
            onChangeText={ setNewProgress }
          />

          <View className='flex-col gap-3 mt-6'>
            <CustomButton
              title='Mettre à jour'
              onPress={ handleUpdateProgress }
              variant='secondary'
            />

            <CustomButton
              title='Annuler'
              onPress={ handleClose }
              isLoading={ isUpdating }
              variant='primary'
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Mémoriser le composant
export default memo( UpdateGoalModal, ( prevProps, nextProps ) => {
  // Ne re-render que si les props essentielles ont changé
  return (
    prevProps.modalVisible === nextProps.modalVisible &&
    prevProps.newProgress === nextProps.newProgress &&
    prevProps.isUpdating === nextProps.isUpdating &&
    prevProps.progress === nextProps.progress
  );
} );