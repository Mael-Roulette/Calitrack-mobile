import { STORAGE_KEYS } from "@/constants/storageKeys";
import useWeeksStore from "@/store/week.store";
import { Training } from "@/types";
import { getValue, removeValue } from "@/utils/local-storage";
import { formatMinutesDuration } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Text, View } from "react-native";
import CustomButton from "../ui/CustomButton";
import PrimaryGradient from "../ui/PrimaryGradient";

interface TrainingDayProps {
  training: Training
}

interface SavedProgress {
  trainingId: string;
}

export default function TrainingDay ( { training }: TrainingDayProps ) {
  const { getWeekById } = useWeeksStore();
  const week = getWeekById( training.week );
  const [ hasSavedProgress, setHasSavedProgress ] = useState( false );

  useFocusEffect(
    useCallback( () => {
      let isActive = true;

      const checkProgress = async () => {
        const raw = await getValue( STORAGE_KEYS.TRAINING_IN_PROGRESS );

        if ( !raw ) {
          if ( isActive ) setHasSavedProgress( false );
          return;
        }

        try {
          const saved: SavedProgress = JSON.parse( raw );
          if ( isActive ) setHasSavedProgress( saved.trainingId === training.$id );
        } catch {
          if ( isActive ) setHasSavedProgress( false );
        }
      };

      checkProgress();

      return () => {
        isActive = false;
      };
    }, [ training.$id ] )
  );

  const handleLaunchTraining = () => {
    if ( !hasSavedProgress ) {
      router.push( {
        pathname: "/training/[id]/session",
        params: { id: training.$id, resume: "false" },
      } );
      return;
    }

    Alert.alert(
      "Séance en cours",
      "Vous avez une séance en cours pour cet entraînement. Voulez-vous la reprendre ou recommencer à zéro ?",
      [
        {
          text: "Recommencer",
          style: "destructive",
          onPress: async () => {
            await removeValue( STORAGE_KEYS.TRAINING_IN_PROGRESS );
            setHasSavedProgress( false );
            router.push( {
              pathname: "/training/[id]/session",
              params: { id: training.$id, resume: "false" },
            } );
          },
        },
        {
          text: "Reprendre",
          onPress: () => {
            router.push( {
              pathname: "/training/[id]/session",
              params: { id: training.$id, resume: "true" },
            } );
          },
        },
        { text: "Annuler", style: "cancel" },
      ]
    );
  };

  return (
    <PrimaryGradient>
      <View className='px-4 py-4'>
        <View className="flex-row items-center justify-between gap-5">
          <Text
            numberOfLines={ 1 }
            ellipsizeMode="tail"
            className="text-lg-custom text-background flex-shrink">
            { week?.name } : { training.name }
          </Text>

          <View className="flex-row gap-2 items-center">
            <Ionicons name="time" size={ 24 } color={ "#FFF9F7" } />
            <Text className="text text-background">{ formatMinutesDuration( training.duration ) }</Text>
          </View>
        </View>

        { hasSavedProgress && (
          <View className="flex-row items-center gap-2 mt-2">
            <Ionicons name="refresh" size={ 20 } color={ "#FFF9F7" } />
            <Text className="text text-background">Séance en cours</Text>
          </View>
        ) }

        <CustomButton
          title={ hasSavedProgress ? "Reprendre ma séance" : "Lancer ma séance" }
          onPress={ handleLaunchTraining }
          customStyles="border-0 mt-5"
        />
      </View>
    </PrimaryGradient>
  );
}