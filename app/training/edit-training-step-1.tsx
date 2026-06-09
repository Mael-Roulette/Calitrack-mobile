import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import CustomTags from "@/components/ui/CustomTags";
import CustomTimePicker from "@/components/ui/CustomTimePicker";
import { DAYS_TRANSLATION } from "@/constants/date";
import useTrainingsStore from "@/store/training.store";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function EditTrainingStep1 () {
  const { trainingId } = useLocalSearchParams<{ trainingId: string }>();
  const { currentTraining } = useTrainingsStore();

  const [ duration, setDuration ] = useState( 0 );
  const [ days, setDays ] = useState<string[]>( [] );
  const [ note, setNote ] = useState( "" );
  const [ errors, setErrors ] = useState<{ duration?: string }>( {} );
  const [ flexToggle, setFlexToggle ] = useState( false );

  // Pré-remplissage avec les données existantes
  useEffect( () => {
    if ( currentTraining ) {
      setDuration( currentTraining.duration );
      setDays( currentTraining.days ?? [] );
      setNote( currentTraining.note ?? "" );
    }
  }, [ currentTraining ] );

  useEffect( () => {
    const showListener = Keyboard.addListener( "keyboardDidShow", () => setFlexToggle( false ) );
    const hideListener = Keyboard.addListener( "keyboardDidHide", () => setFlexToggle( true ) );
    return () => { showListener.remove(); hideListener.remove(); };
  }, [] );

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if ( duration <= 0 ) {
      newErrors.duration = "Veuillez définir une durée supérieure à 0.";
    }
    setErrors( newErrors );
    return Object.keys( newErrors ).length === 0;
  };

  const handleNext = () => {
    if ( !validate() ) return;

    router.push( {
      pathname: "/training/edit-training-step-2",
      params: {
        trainingId,
        trainingName: currentTraining?.name ?? "",
        duration: String( duration ),
        days: JSON.stringify( days ),
        note,
      },
    } );
  };

  return (
    <View className="flex-1">
      <PageHeader title={ currentTraining?.name ?? "Modifier l'entraînement" } />

      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ flexToggle ? [ { flexGrow: 1 } ] : [ { flex: 1 } ] }
        enabled={ !flexToggle }
      >
        <ScrollView
          className="flex-1 bg-background px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={ false }
          contentContainerStyle={ { paddingTop: 24, paddingBottom: 40 } }
        >
          <View className="mb-1">
            <CustomTimePicker
              label="Durée de la séance"
              value={ duration }
              onChange={ ( durationMinutes ) => {
                setDuration( durationMinutes );
                if ( errors.duration ) setErrors( ( e ) => ( { ...e, duration: undefined } ) );
              } }
              showSeconds={ false }
              minutesInterval={ 5 }
            />
          </View>
          {errors.duration ? (
            <Text className="text-red-500 font-sregular text-sm mb-4">{errors.duration}</Text>
          ) : (
            <View className="mb-6" />
          )}

          <View className="mb-6">
            <CustomTags
              label="Jours de disponibilité (facultatif)"
              placeholder="Sélectionnez vos jours..."
              suggestions={ [ ...DAYS_TRANSLATION ] }
              value={ days }
              onChangeText={ ( selected: string[] ) => setDays( selected ) }
              maxTags={ 7 }
              allowCustomTags={ false }
            />
          </View>

          <View className="mb-8">
            <CustomInput
              label="Note personnelle (facultatif)"
              placeholder="Ex : Focus sur la forme, pause café après..."
              value={ note }
              onChangeText={ setNote }
              multiline
              numberOfLines={ 5 }
              customStyles="h-32"
            />
          </View>
        </ScrollView>

        <View className="bg-background px-5 py-4 flex-row gap-3 border-t border-primary-100/10">
          <CustomButton
            title="Annuler"
            onPress={ () => router.back() }
            customStyles="flex-1"
            variant="primary"
          />
          <CustomButton
            title="Suivant"
            onPress={ handleNext }
            customStyles="flex-1"
            variant="secondary"
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}