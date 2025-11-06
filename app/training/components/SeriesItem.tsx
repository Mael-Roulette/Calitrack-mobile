import { SeriesParams } from "@/types/series";
import { Feather } from "@expo/vector-icons";
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from "@/components/CustomButton";
import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import { router } from "expo-router";

interface SeriesItemProps {
  state: "edit" | "view";
  seriesData: SeriesParams;
  index?: number;
  onDelete?: () => void;
}

const SeriesItem = ( { state, seriesData, onDelete }: SeriesItemProps ) => {
  const [ showDelete, setShowDelete ] = useState( false );
  const [ showDetailsModal, setShowDetailsModal ] = useState( false );

  const handleDelete = () => {
    setShowDelete( false );
    if ( onDelete ) {
      onDelete();
    }
  };

  const formatValue = () => {
    const { exercise, targetValue } = seriesData;
    if ( exercise.format === "hold" ) {
      return `${targetValue}s`;
    }
    return targetValue;
  };

  const goToExerciseDetails = ( id: string ) => {
    router.push( {
      pathname: "/exercise/[id]",
      params: { id },
    } );
  };

  return (
    <View className="px-5 py-4 mb-3 rounded-md border border-secondary flex-row items-center justify-between">
      {/* Indicateur de drag pour l'édition */ }
      { state === 'edit' && (
        <View className="mr-3">
          <MaterialIcons name="drag-indicator" size={ 28 } color="#132541" />
        </View>
      ) }

      {/* Numéro de série */ }
      { state === 'view' && (
        <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center mr-3">
          <Text className="text-background font-sbold text-sm">{ seriesData.order }</Text>
        </View>
      ) }

      {/* Informations de la série */ }
      <View className="flex-1">
        <Text className="text-primary font-sregular text-base mb-1">
          { seriesData.exercise.name }
        </Text>
        <Text className="text-primary-100 font-sregular text-sm">
          { seriesData.sets } x { formatValue() }
          { seriesData.restTime && `  •  ${seriesData.restTime}min repos` }
        </Text>
      </View>

      {/* Actions */ }
      <View>
        { state === 'edit' && (
          <TouchableOpacity
            onPress={ () => setShowDelete( true ) }
            accessibilityLabel='Supprimer'
            style={ { paddingLeft: 24 } }
          >
            <Feather name='trash-2' size={ 20 } color='#ef4444' />
          </TouchableOpacity>
        ) }

        { state === 'view' && (
          <TouchableOpacity
            onPress={ () => setShowDetailsModal( !showDetailsModal ) }
            accessibilityLabel='Voir la série'
            style={ { paddingLeft: 24 } }
          >
            <Entypo name="chevron-small-right" size={ 44 } color="#FC7942" />
          </TouchableOpacity>
        ) }
      </View>

      {/* Modal de confirmation de suppression */ }
      { showDelete && (
        <Modal
          transparent={ true }
          visible={ showDelete }
          animationType='fade'
          onRequestClose={ () => setShowDelete( false ) }
        >
          <TouchableOpacity
            style={ {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            } }
            activeOpacity={ 1 }
            onPress={ () => setShowDelete( false ) }
          >
            <View className="w-4/5 h-fit flex-col justify-center items-center gap-4 py-4 px-6 bg-background rounded-md">
              <Text className="text-center font-sregular text-primary">
                Êtes-vous sûr de supprimer cette série ? Cette action est irréversible.
              </Text>
              <View className="flex-row gap-3 w-full">
                <TouchableOpacity
                  onPress={ () => setShowDelete( false ) }
                  className='flex-1 items-center justify-center px-4 py-3 border border-secondary rounded-md'
                >
                  <Text className='text-base text-primary font-sregular'>
                    Annuler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={ handleDelete }
                  className='flex-1 flex-row items-center justify-center px-4 py-3 bg-red-500 rounded-md'
                >
                  <Feather name='trash-2' size={ 18 } color='white' />
                  <Text className='ml-2 text-base text-white font-sregular'>
                    Supprimer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      ) }

      { showDetailsModal && (
        <Modal
          statusBarTranslucent={ true }
          animationType='slide'
          transparent={ true }
          visible={ showDetailsModal }
          onRequestClose={ () => setShowDetailsModal( false ) }
        >
          <SafeAreaView className='flex-1 bg-black/40 justify-end' edges={ [ 'bottom' ] }>
            <View className='bg-background p-5 h-4/5 w-full' style={ { borderTopLeftRadius: 20, borderTopRightRadius: 20, } }>
              <ScrollView className="px-5">
                <View className="w-full flex justify-center items-end">
                  <TouchableWithoutFeedback className="w-fit" onPress={ () => setShowDetailsModal( false ) }>
                    <AntDesign name="close" size={ 28 } color="#132541" />
                  </TouchableWithoutFeedback>
                </View>
                <View className="flex-col gap-5">
                  <View>
                    <Text className="title-3 mb-2">Exercice lié :</Text>
                    <ExerciseItem
                      image={ seriesData.exercise.image }
                      name={ seriesData.exercise.name }
                      difficulty={ seriesData.exercise.difficulty }
                      onPress={ () => goToExerciseDetails( seriesData.exercise.$id ) }
                    />
                  </View>
                  <View className="flex-row flex-wrap items-start justify-between">
                    <View>
                      <Text className="title-3">
                        { seriesData.exercise.format === 'hold' ? (
                          "Temps de hold"
                        ) : seriesData.exercise.format === 'repetition' ? (
                          "Nombre de répétition"
                        ) : "Valeur à atteindre" }
                      </Text>
                      <Text className="text">{ seriesData.targetValue } { seriesData.exercise.format === 'hold' && 'seconde(s)'} </Text>
                    </View>

                    <View>
                      <Text className="title-3">Nombre de série</Text>
                      <Text className="text">{ seriesData.sets }</Text>
                    </View>
                  </View>
                  <View>
                    <Text className="title-3">Temps de repos entre les séries</Text>
                    <Text className="text">{ seriesData.restTime === null ? "0" : seriesData.restTime } minutes</Text>
                  </View>
                  <View>
                    <Text className="title-3">Note personnelle</Text>
                    <Text className="text">{ seriesData.note }</Text>
                  </View>
                </View>
              </ScrollView>

              <CustomButton
                title="Revenir à l'entraînement"
                variant="secondary"
                onPress={ () => setShowDetailsModal( false ) }
              />
            </View>
          </SafeAreaView>
        </Modal>
      ) }
    </View>
  );
};

export default SeriesItem;