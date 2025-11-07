import { getExericseById } from "@/lib/exercise.appwrite";
import { Exercise } from "@/types";
import { CreateSeriesParams, SeriesParams } from "@/types/series";
import { Feather } from "@expo/vector-icons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type MixedSeriesType = SeriesParams | Omit<CreateSeriesParams, "training" | "order">;

interface SeriesItemProps {
  seriesData: MixedSeriesType;
  onDrag: () => void;
  onDelete: () => void;
  onEdit: () => void;
  isActive?: boolean;
}

const SeriesItemEdit = ( { seriesData, onDrag, onDelete, onEdit, isActive }: SeriesItemProps ) => {
  const [ showDelete, setShowDelete ] = useState<boolean>( false );
  const [ , setLoading ] = useState<boolean>( true );
  const [ exercise, setExercise ] = useState<Exercise>();

  useEffect( () => {
    const fetchExercise = async () => {
      setLoading( true );
      try {
        if ( typeof seriesData.exercise === "string" ) {
          const response = await getExericseById( seriesData.exercise ) as any as Exercise;
          setExercise( response );
        } else {
          setExercise( seriesData.exercise );
        }

      } catch ( error ) {
        console.error( "Erreur lors de la récupération de l'exercice", error );
      } finally {
        setLoading( false );
      }
    };
    fetchExercise();
  }, [ seriesData.exercise ] );

  const handleDelete = () => {
    setShowDelete( false );
    onDelete();
  };

  if ( !exercise ) return;

  const formatValue = () => {
    if ( exercise.format === "hold" ) {
      return `${seriesData.targetValue}s`;
    }
    return seriesData.targetValue;
  };

  return (
    <View className="py-4 mb-3 bg-background rounded-md border border-secondary flex-row items-center justify-between">
      {/* Indicateur de drag pour l'édition */ }
      <TouchableOpacity
        onLongPress={ onDrag }
        disabled={ isActive }
        delayLongPress={ 80 }
        style={ { paddingHorizontal: 18, paddingVertical: 12 } }
        activeOpacity={ 0.6 }
      >
        <MaterialIcons name="drag-indicator" size={ 28 } color="#132541" />
      </TouchableOpacity>

      {/* Informations de la série - maintenant cliquable */ }
      <TouchableOpacity
        className="flex-1"
        onPress={ onEdit }
        activeOpacity={ 0.7 }
      >
        <Text className="text-primary font-sregular text-base mb-1">
          { exercise.name }
        </Text>
        <Text className="text-primary-100 font-sregular text-sm">
          { seriesData.sets } x { formatValue() }
          { seriesData.restTime && `  •  ${seriesData.restTime}min repos` }
        </Text>
      </TouchableOpacity>

      {/* Actions */ }
      <View>
        <TouchableOpacity
          onPress={ () => setShowDelete( true ) }
          accessibilityLabel='Supprimer'
          style={ { padding: 12, paddingRight: 24 } }
        >
          <Feather name='trash-2' size={ 20 } color='#ef4444' />
        </TouchableOpacity>
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
    </View>
  );
};

export default SeriesItemEdit;