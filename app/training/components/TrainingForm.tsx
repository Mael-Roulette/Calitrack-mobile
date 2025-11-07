import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import CustomTimePicker from "@/components/CustomTimePicker";
import { DAYS_TRANSLATION } from "@/constants/value";
import { Training, createTrainingParams } from "@/types";
import { CreateSeriesParams, SeriesParams } from "@/types/series";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import SeriesItemList from "./SeriesItemList";
import CustomButton from "@/components/CustomButton";
import SeriesFormModal from "./SeriesFormModal";

interface TrainingFormParams {
  initialData?: Training;
  onSubmit: ( form: Partial<createTrainingParams>, seriesList: MixSeriesType[] ) => void | undefined;
  submitButtonText: string;
  isSubmitting: boolean;
}

export type MixSeriesType = Omit<CreateSeriesParams, "training" | "order"> | SeriesParams;

const TrainingForm = ( { initialData, onSubmit, submitButtonText, isSubmitting }: TrainingFormParams ) => {
  const [ isModalVisible, setIsModalVisible ] = useState<boolean>( false );

  // Info trainings
  const [ form, setForm ] = useState<Partial<createTrainingParams>>( {
    name: "",
    days: [],
    duration: 0,
  } );
  const [ selectedDays, setSelectedDays ] = useState<string[] | undefined>( [] );
  const [ seriesList, setSeriesList ] = useState<MixSeriesType[]>( [] );
  const [ editingSeries, setEditingSeries ] = useState<MixSeriesType | null>( null );
  const [ editingIndex, setEditingIndex ] = useState<number | null>( null );


  // Ajout des informations de l'entrainement si elles existent
  useEffect( () => {
    if ( initialData ) {
      setForm( {
        name: initialData.name,
        days: initialData.days,
        duration: initialData.duration
      } );

      setSelectedDays( initialData.days );

      if ( initialData.series ) setSeriesList( initialData.series )
    }
  }, [ initialData ] );


  // Gestion de la modal d'ajout de série
  //Permet de gérer la visibilité de la modal
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
  const handleSeriesUpdated = (
    series: MixSeriesType,
    index: number
  ) => {
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
  const handleSeriesListChange = (
    newList: MixSeriesType[]
  ) => {
    setSeriesList( newList );
  };

  return (
    <View>
      <View className="flex-1">
        <View className=" flex-1 flex-col gap-5 pb-5">
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
              />
            ) : (
              <Text className="indicator-text">Aucune série ajoutée</Text>
            ) }
          </View>
        </View>
      </View>

      <View className="pb-5">
        <CustomButton
          title="Ajouter une série"
          variant="secondary"
          onPress={ handleModalVisibility }
          customStyles="mb-3 mt-6"
        />
        <CustomButton
          title={ submitButtonText }
          onPress={ onSubmit( form, seriesList ) }
          isLoading={ isSubmitting }
        />
      </View>

      <SeriesFormModal
        isVisible={ isModalVisible }
        closeModal={ handleModalVisibility }
        onSeriesCreated={ handleSeriesCreated }
        editingSeries={ editingSeries }
        editingIndex={ editingIndex }
        onSeriesUpdated={ handleSeriesUpdated }
      />
    </View>
  );
}

export default TrainingForm;