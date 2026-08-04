import useTrainingActions from "@/hooks/actions/training/useTrainingActions";
import { useState } from "react";
import { Modal, Text, View } from "react-native";
import CustomButton from "../ui/CustomButton";
import CustomInput from "../ui/CustomInput";

interface RenameTrainingModalProps {
  modalVisible: boolean;
  setModalVisible: ( value: boolean ) => void;
  trainingId: string,
  actualTrainingName: string,
}

export default function RenameTrainingModal ( {
  modalVisible,
  setModalVisible,
  trainingId,
  actualTrainingName
}: RenameTrainingModalProps ) {
  const [ trainingName, setTrainingName ] = useState( "" );
  const { handleRename, isSubmitting } = useTrainingActions();

  const handleClose = () => {
    if ( !isSubmitting ) {
      setTrainingName( "" );
      setModalVisible( false );
    }
  };

  const handleSubmit = async () => {
    if ( !trainingName.trim() ) {
      return;
    }

    try {
      await handleRename( {
        trainingId,
        newName: trainingName.trim()
      } );
    } catch ( error ) {
      console.log( error );
    } finally {
      setTrainingName( "" );
      setModalVisible( false );
    }
  };


  return (
    <View>
      <Modal
        animationType="fade"
        transparent={ true }
        visible={ modalVisible }
        statusBarTranslucent={ true }
        onRequestClose={ handleClose }
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-background w-[85%] p-6 rounded-xl">
            <Text className="title-2">Créer une semaine</Text>

            <CustomInput
              label="Nom de la semaine"
              value={ trainingName }
              placeholder={ actualTrainingName }
              onChangeText={ setTrainingName }
            />

            <View className="flex-col gap-3 mt-6">
              <CustomButton
                title="Renommer"
                onPress={ handleSubmit }
                isLoading={ isSubmitting }
                variant="secondary"
              />
              <CustomButton
                title="Annuler"
                onPress={ handleClose }
                variant="primary"
                isLoading={ isSubmitting }
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}