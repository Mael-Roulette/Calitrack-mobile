import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import CustomTags from "@/components/ui/CustomTags";
import CustomTimePicker from "@/components/ui/CustomTimePicker";
import { DAYS_TRANSLATION } from "@/constants/value";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
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

  const handleNext = () => {
    router.push( {
      pathname: "/training/add-training-step-2",
      params: {
        weekId,
        trainingName,
        duration: duration,
        days: JSON.stringify( days ),
        note,
      },
    } );
  };

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <PageHeader title={ trainingName || "Nom de l'entrainement" } />

      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ { flex: 1, backgroundColor: "#FFF9F7" } }
      >
        <ScrollView
          className="flex-1 bg-background px-5"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={ false }
          contentContainerStyle={ { paddingTop: 24, paddingBottom: 40 } }
        >
          {/* Durée */}
          <View className="mb-6">
            <CustomTimePicker
              label="Durée de la séance"
              value={ duration || 0 }
              onChange={ ( durationMinutes ) =>
                setDuration( () => durationMinutes )
              }
              showSeconds={ false }
              minutesInterval={ 5 }
            />
          </View>

          {/* Jours attribués */}
          <View className="mb-6">
            <CustomTags
              label="Jours de disponibilité"
              placeholder="Sélectionnez vos jours d'entraînement..."
              suggestions={ DAYS_TRANSLATION }
              value={ days }
              onChangeText={ ( days: string[] ) => {
                setDays( days );
              } }
              maxTags={ 7 }
              allowCustomTags={ false }
            />
          </View>

          {/* Note personnelle */}
          <View className="mb-8">
            <CustomInput
              label="Note personnelle (facultatif)"
              placeholder="Ma note"
              value={ note }
              onChangeText={ setNote }
              multiline
              numberOfLines={ 5 }
              customStyles="h-32"
            />
          </View>
        </ScrollView>

        {/* Boutons d'action */}
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
