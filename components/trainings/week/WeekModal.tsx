import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import useWeekActions from "@/hooks/actions/useWeekActions";
import { useState } from "react";
import { Modal, Text, View } from "react-native";

interface WeekModalProps {
  modalVisible: boolean;
  setModalVisible: ( value: boolean ) => void;
  nextOrder: number;
}

export default function WeekModal ( {
  modalVisible,
  setModalVisible,
  nextOrder
}: WeekModalProps ) {
  const [ weekName, setWeekName ] = useState( "" );
  const { handleCreate, isSubmitting } = useWeekActions();

  const handleClose = () => {
    if ( !isSubmitting ) {
      setWeekName( "" );
      setModalVisible( false );
    }
  };

  const handleSubmit = async () => {
    if ( !weekName.trim() ) {
      return;
    }

    try {
      await handleCreate( {
        name: weekName.trim(),
        order: nextOrder
      } );
    } catch ( error ) {
      console.log( error );
    } finally {
      setWeekName( "" );
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
              value={ weekName }
              placeholder={ `Ex: Semaine ${nextOrder}` }
              onChangeText={ setWeekName }
            />

            <View className="flex-col gap-3 mt-6">
              <CustomButton
                title="Créer"
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
