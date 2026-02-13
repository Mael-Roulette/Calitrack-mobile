import { Feather } from "@expo/vector-icons";
import { memo } from "react";
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from "react-native";

interface DeleteGoalModalProps {
  showDelete: boolean;
  setShowDelete: ( value: boolean ) => void;
  handleDelete: () => void;
  isDeleting?: boolean;
}

function DeleteGoalModal ( {
  showDelete,
  setShowDelete,
  handleDelete,
  isDeleting = false
}: DeleteGoalModalProps ) {
  return (
    <Modal
      transparent={ true }
      visible={ showDelete }
      animationType='fade'
      onRequestClose={ () => !isDeleting && setShowDelete( false ) }
      statusBarTranslucent
    >
      <TouchableOpacity
        style={ {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        } }
        activeOpacity={ 1 }
        onPress={ () => !isDeleting && setShowDelete( false ) }
        disabled={ isDeleting }
      >
        <TouchableOpacity
          activeOpacity={ 1 }
          onPress={ ( e ) => e.stopPropagation() }
        >
          <View className="w-80 flex-col justify-center items-center gap-4 py-6 px-6 bg-background rounded-xl">
            <View>
              <Text className="text-center font-calsans text-xl text-primary mb-2">
                Supprimer l'objectif
              </Text>
              <Text className="text-center font-sregular text-primary-100">
                Êtes-vous sûr de vouloir supprimer cet objectif ? Cette action est irréversible.
              </Text>
            </View>

            <View className="w-full gap-2">
              <TouchableOpacity
                onPress={ handleDelete }
                disabled={ isDeleting }
                className={ `flex-row items-center justify-center px-4 py-3 w-full border-2 border-red-500 rounded-lg ${
                  isDeleting ? "opacity-50" : ""
                }` }
              >
                { isDeleting ? (
                  <ActivityIndicator size="small" color="#ef4444" />
                ) : (
                  <>
                    <Feather name='trash-2' size={ 18 } color='#ef4444' />
                    <Text className='ml-3 text-base text-red-500 font-sregular font-bold'>
                      Supprimer
                    </Text>
                  </>
                ) }
              </TouchableOpacity>

              <TouchableOpacity
                onPress={ () => setShowDelete( false ) }
                disabled={ isDeleting }
                className={ `flex-row items-center justify-center px-4 py-3 w-full bg-secondary rounded-lg ${
                  isDeleting ? "opacity-50" : ""
                }` }
              >
                <Text className='text-base text-background font-sregular font-bold'>
                  Annuler
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export default memo( DeleteGoalModal );