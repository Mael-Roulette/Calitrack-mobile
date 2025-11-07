import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import CustomButton from "@/components/CustomButton";
import { SeriesParams } from "@/types/series";
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SeriesItemProps {
  seriesData: SeriesParams;
}

const SeriesItem = ( { seriesData }: SeriesItemProps ) => {
  const [ showDetailsModal, setShowDetailsModal ] = useState( false );

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
      {/* Numéro de série */ }
      <View className="w-8 h-8 rounded-full bg-secondary items-center justify-center mr-3">
        <Text className="text-background font-sbold text-sm">{ seriesData.order }</Text>
      </View>

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
        <TouchableOpacity
          onPress={ () => setShowDetailsModal( !showDetailsModal ) }
          accessibilityLabel='Voir la série'
          style={ { paddingLeft: 24 } }
        >
          <Entypo name="chevron-small-right" size={ 44 } color="#FC7942" />
        </TouchableOpacity>
      </View>

      { showDetailsModal && (
        <Modal
          statusBarTranslucent={ true }
          animationType='slide'
          transparent={ true }
          visible={ showDetailsModal }
          onRequestClose={ () => setShowDetailsModal( false ) }
        >
          <SafeAreaView className='flex-1 bg-black/40 justify-end' edges={ [ 'bottom' ] }>
            <View className='bg-background py-5 h-4/5 w-full' style={ { borderTopLeftRadius: 20, borderTopRightRadius: 20, } }>
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
                      <Text className="text">{ seriesData.targetValue } { seriesData.exercise.format === 'hold' && 'seconde(s)' } </Text>
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

              <View className="px-5">
                <CustomButton
                  title="Revenir à l'entraînement"
                  variant="secondary"
                  onPress={ () => setShowDetailsModal( false ) }
                />
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      ) }
    </View>
  );
};

export default SeriesItem;