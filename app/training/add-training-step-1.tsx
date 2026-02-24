import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import CustomTags from "@/components/ui/CustomTags";
import CustomTimePicker from "@/components/ui/CustomTimePicker";
import { DAYS_TRANSLATION } from "@/constants/value";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTrainingStep1 () {
  const { weekId, trainingName } = useLocalSearchParams<{
    weekId: string;
    trainingName: string;
  }>();

  const [ duration, setDuration ] = useState( 0 );
  const [ days, setDays ] = useState<string[]>( [] );
  const [ note, setNote ] = useState( "" );
  const [ errors, setErrors ] = useState<{ duration?: string; days?: string }>( {} );
  const [ flexToggle, setFlexToggle ] = useState( false );

  useEffect( () => {
    const keyboardShowListener = Keyboard.addListener( "keyboardDidShow", () => {
      setFlexToggle( false );
    } );

    const keyboardHideListener = Keyboard.addListener( "keyboardDidHide", () => {
      setFlexToggle( true );
    } );

    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
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
      pathname: "/training/add-training-step-2",
      params: {
        weekId,
        trainingName,
        duration: String( duration ),
        days: JSON.stringify( days ),
        note,
      },
    } );
  };

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } } edges={ [ "bottom" ] }>
      <PageHeader title={ trainingName || "Nouvel entraînement" } />

      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        keyboardVerticalOffset={ Platform.OS === "ios" ? 0 : 0 }
        style={
          flexToggle
            ? [ { flexGrow: 1 } ]
            : [ { flex: 1 } ]
        }
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
          {errors.duration && (
            <Text className="text-red-500 font-sregular text-sm mb-4">
              {errors.duration}
            </Text>
          )}
          {!errors.duration && <View className="mb-6" />}

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
    </SafeAreaView>
  );
}
