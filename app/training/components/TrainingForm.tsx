import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import CustomTimePicker from "@/components/CustomTimePicker";
import { DAYS_TRANSLATION } from "@/constants/value";
import { Training, createTrainingParams } from "@/types";
import { CreateSeriesParams, SeriesParams } from "@/types/series";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SeriesFormModal from "./SeriesFormModal";
import SeriesItemList from "./SeriesItemList";

interface TrainingFormParams {
  initialData?: Training;
  onSubmit: ( data: { form: Partial<createTrainingParams>, seriesList: MixSeriesType[] } ) => void;
  submitButtonText: string;
  isSubmitting: boolean;
}

export type MixSeriesType = Omit<CreateSeriesParams, "training" | "order"> | SeriesParams;

const TrainingForm = ( { initialData, onSubmit, submitButtonText, isSubmitting }: TrainingFormParams ) => {
  const [ isModalVisible, setIsModalVisible ] = useState<boolean>( false );
  const scrollViewRef = useRef( null );

  // Info trainings
  const [ form, setForm ] = useState<Partial<createTrainingParams>>( {
    name: "",
    days: [],
    duration: 0,
  } );
  const [ selectedDays, setSelectedDays ] = useState<string[]>( [] );
  const [ seriesList, setSeriesList ] = useState<MixSeriesType[]>( [] );
  const [ editingSeries, setEditingSeries ] = useState<MixSeriesType | null>( null );
  const [ editingIndex, setEditingIndex ] = useState<number | null>( null );

  // FIX: Ajout des informations de l'entrainement si elles existent
  useEffect( () => {
    if ( initialData ) {
      setForm( {
        name: initialData.name,
        days: initialData.days,
        duration: initialData.duration
      } );

      // Mise à jour des jours sélectionnés
      setSelectedDays( initialData.days || [] );

      if ( initialData.series ) {
        setSeriesList( initialData.series );
      }
    }
  }, [ initialData ] );

  // Gestion de la modal d'ajout de série
  const handleModalVisibility = () => {
    if ( !isModalVisible ) {
      setEditingSeries( null );
      setEditingIndex( null );
    }
    setIsModalVisible( !isModalVisible );
  };

  // Ajout de la création créer dans la liste
  const handleSeriesCreated = ( series: MixSeriesType ) => {
    setSeriesList( ( prev ) => [ ...prev, series ] );
  };

  // Mise à jour d'une série dans la liste
  const handleSeriesUpdated = ( series: MixSeriesType, index: number ) => {
    setSeriesList( ( prev ) => {
      const newList = [ ...prev ];
      newList[ index ] = series;
      return newList;
    } );
  };

  // Permet d'ouvrir la modal avec les infos d'une série
  const handleEditSeries = ( index: number ) => {
    setEditingSeries( seriesList[ index ] );
    setEditingIndex( index );
    setIsModalVisible( true );
  };

  // Permet de modifier l'ordre de la liste
  const handleSeriesListChange = ( newList: MixSeriesType[] ) => {
    // Utilisez un callback pour éviter les rerenders inutiles
    setSeriesList( ( prevList ) => {
      // Vérifier si la liste a vraiment changé
      if ( JSON.stringify( prevList ) === JSON.stringify( newList ) ) {
        return prevList;
      }
      return newList;
    } );
  };

  // Fonction de soumission
  const handleSubmit = () => {
    onSubmit( { form, seriesList } );
  };

  // Header du formulaire
  const renderHeader = () => (
    <View className="flex-col gap-5 pb-5">
      <CustomInput
        label="Nom de l'entraînement"
        value={ form.name }
        placeholder="Ex : Planche + combo"
        onChangeText={ ( t: string ) =>
          setForm( ( p ) => ( { ...p, name: t } ) )
        }
      />

      <CustomTimePicker
        label="Durée de la séance"
        value={ form.duration || 0 }
        onChange={ ( durationMinutes ) =>
          setForm( ( p ) => ( { ...p, duration: durationMinutes } ) )
        }
        showSeconds={ false }
        minutesInterval={ 5 }
      />

      <CustomTags
        label="Jours de disponibilité"
        placeholder="Sélectionnez vos jours d'entraînement..."
        suggestions={ DAYS_TRANSLATION }
        value={ selectedDays }
        onChangeText={ ( days ) => {
          setSelectedDays( days );
          setForm( ( prev ) => ( { ...prev, days } ) );
        } }
        maxTags={ 7 }
        allowCustomTags={ false }
      />
    </View>
  );

  // Footer du formulaire
  const renderFooter = () => (
    <View className="pb-5 pt-5">
      <CustomButton
        title="Ajouter une série"
        variant="secondary"
        onPress={ handleModalVisibility }
        customStyles="mb-3"
      />
      <CustomButton
        title={ submitButtonText }
        onPress={ handleSubmit }
        isLoading={ isSubmitting }
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1">
        <ScrollView
          className="flex-1"
          ref={ scrollViewRef }
          nestedScrollEnabled={ true }
        >
          <View className="flex-1 flex-col gap-5 pb-5">
            { renderHeader() }

            <View className="flex-1">
              <Text className="text-primary font-sregular text-lg mb-3">
                Mes séries ({ seriesList.length })
              </Text>

              { seriesList.length > 4 && (
                <Text className="text-sm text-primary-100 font-sregular mb-4">
                  Attention, avoir trop d&apos;exercices différents dans son
                  entraînement n&apos;est pas forcément une bonne chose
                </Text>
              ) }

              { seriesList.length > 0 ? (
                <SeriesItemList
                  seriesList={ seriesList }
                  onSeriesListChange={ handleSeriesListChange }
                  onEditSeries={ handleEditSeries }
                  scrollViewRef={ scrollViewRef }
                />
              ) : (
                <Text className="indicator-text">Aucune série ajoutée</Text>
              ) }
            </View>
          </View>
        </ScrollView>

        { renderFooter() }

        <SeriesFormModal
          isVisible={ isModalVisible }
          closeModal={ handleModalVisibility }
          onSeriesCreated={ handleSeriesCreated }
          editingSeries={ editingSeries }
          editingIndex={ editingIndex }
          onSeriesUpdated={ handleSeriesUpdated }
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default TrainingForm;