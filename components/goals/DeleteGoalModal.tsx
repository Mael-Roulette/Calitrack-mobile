import { Feather } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface DeleteGoalModalProps {
  showDelete: boolean;
  setShowDelete: ( value: boolean ) => void;
  handleDelete: () => void;
}

export default function DeleteGoalModal ( {
  showDelete,
  setShowDelete,
  handleDelete
}: DeleteGoalModalProps ) {
  return (
    <Modal
      transparent={ true }
      visible={ showDelete }
      animationType='fade'
      onRequestClose={ () => setShowDelete( false ) }
    >
      <TouchableOpacity
        style={ {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        } }
        activeOpacity={ 1 }
        onPress={ () => setShowDelete( false ) }
      >
        <TouchableOpacity
          activeOpacity={ 1 }
          onPress={ ( e ) => e.stopPropagation() }
        >
          <View className="w-4/5 h-fit flex-col justify-center items-center gap-4 py-4 px-6 bg-background rounded-md">
            <View>
              <Text className="text-center font-sregular">
                Êtes-vous sûr de supprimer cet objectif ? Cette action est irréversible.
              </Text>
            </View>
            <TouchableOpacity
              onPress={ handleDelete }
              className='flex-row items-center justify-center px-4 py-3 w-full border border-secondary rounded-md'
            >
              <Feather name='trash-2' size={ 18 } color='#ef4444' />
              <Text className='ml-3 text-base text-red-500 font-sregular'>
                Supprimer
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}