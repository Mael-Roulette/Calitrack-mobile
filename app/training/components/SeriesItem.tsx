import { SeriesParams } from "@/types/series";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from "expo-router";


const SeriesItem = ( { state, seriesData }: { state: "edit" | "view", seriesData: SeriesParams } ) => {
  const [ showDelete, setShowDelete ] = useState( false );

  function handleDelete (): void {

  }

  return (
    <View className="px-5 py-4 rounded-md border border-secondary flex-row items-center justify-between">
      {/* View pour la partie draggable */ }
      { state === 'edit' && (
        <View>
          <MaterialIcons name="drag-indicator" size={ 28 } color="#132541" />
        </View>
      ) }

      {/* View pour les infos */ }
      <View className="flex-col">
        <Text className="text"> { seriesData.exercise.name } </Text>
        <Text className="text text-md opacity-75"> { seriesData.sets }X { seriesData.targetValue } </Text>
      </View>

      {/* View pour les actions */ }
      <View>
        { state === 'edit' && (
          <TouchableOpacity
            onPress={ () => setShowDelete( !showDelete ) }
            accessibilityLabel='Supprimer'
            style={ { paddingLeft: 24 } }
          >
            <Feather name='trash-2' size={ 20 } color='#ef4444' />
          </TouchableOpacity>
        ) }

        { state === 'view' && (
          <TouchableOpacity
            onPress={ () => router.push( '/(tabs)/trainings' ) }
            accessibilityLabel='Voir la série'
            style={ { paddingLeft: 24 } }
          >
            <Entypo name="chevron-small-right" size={ 44 } color="#FC7942" />
          </TouchableOpacity>
        ) }
      </View>

      { showDelete && (
        <Modal
          transparent={ true }
          visible={ showDelete }
          animationType='fade'
          onRequestClose={ () => setShowDelete( false ) }
        >
          <TouchableOpacity
            style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }
            activeOpacity={ 1 }
            onPress={ () => setShowDelete( false ) }
          >
            <View className="w-4/5 h-fit flex-col justify-center items-center gap-4 py-4 px-6 bg-background rounded-md">
              <View>
                <Text className="text-center font-sora">Êtes-vous sûr de supprimer cette série ? Cette action est irréversible.</Text>
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
        </Modal>
      ) }
    </View>
  )
}

export default SeriesItem;