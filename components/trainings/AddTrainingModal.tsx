import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Text, View } from "react-native";

interface AddTrainingModalProps {
  modalVisible: boolean;
  setModalVisible: ( value: boolean ) => void;
  weekId: string;
}

/**
 * Point d'entrée du formulaire d'ajout d'entraînement.
 * Demande le nom avant de naviguer vers l'étape 1.
 *
 * Usage dans week/[id]/page.tsx :
 *   <AddTrainingModal
 *     modalVisible={modalVisible}
 *     setModalVisible={setModalVisible}
 *     weekId={week.$id}
 *   />
 */
export default function AddTrainingModal ( {
  modalVisible,
  setModalVisible,
  weekId,
}: AddTrainingModalProps ) {
  const [ trainingName, setTrainingName ] = useState( "" );
  const [ error, setError ] = useState( "" );

  const handleClose = () => {
    setTrainingName( "" );
    setError( "" );
    setModalVisible( false );
  };

  const handleNext = () => {
    const trimmed = trainingName.trim();
    if ( trimmed.length < 2 ) {
      setError( "Le nom doit contenir au moins 2 caractères." );
      return;
    }
    if ( trimmed.length > 50 ) {
      setError( "Le nom ne peut pas dépasser 50 caractères." );
      return;
    }

    handleClose();

    router.push( {
      pathname: "/training/add-training-step-1",
      params: { weekId, trainingName: trimmed },
    } );
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={ modalVisible }
      statusBarTranslucent
      onRequestClose={ handleClose }
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-background w-[85%] p-6 rounded-xl gap-5">
          <Text className="title-2">Nouvel entraînement</Text>

          <View className="gap-1">
            <CustomInput
              label="Nom de l'entraînement"
              value={ trainingName }
              placeholder="Ex: Push Day A"
              onChangeText={ ( text ) => {
                setTrainingName( text );
                if ( error ) setError( "" );
              } }
            />
            {error ? (
              <Text className="text-red-500 font-sregular text-sm">{error}</Text>
            ) : null}
          </View>

          <View className="flex-col gap-3">
            <CustomButton
              title="Suivant"
              onPress={ handleNext }
              variant="secondary"
            />
            <CustomButton
              title="Annuler"
              onPress={ handleClose }
              variant="primary"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
