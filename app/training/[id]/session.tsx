import PageHeader from "@/components/headers/PageHeader";
import SessionActive from "@/components/trainings/session/SessionActive";
import SessionRecap from "@/components/trainings/session/SessionRecap";
import SessionSummary from "@/components/trainings/session/SessionSummary";
import CustomButton from "@/components/ui/CustomButton";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { useSessionActions } from "@/hooks/actions/session/useSessionAction";
import { useConditionalKeepAwake } from "@/hooks/useConditionalKeepAwake";
import { useGoalsStore } from "@/store";
import useTrainingsStore from "@/store/training.store";
import useWeeksStore from "@/store/week.store";
import { Performances } from "@/types/session";
import { showAlert } from "@/utils/alert";
import { getBoolean, setValue } from "@/utils/local-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Les différents états de la session
type SessionState = "summary" | "active" | "completed";

export default function Session () {
  const { id } = useLocalSearchParams();
  const { currentTraining, fetchTrainingById } = useTrainingsStore();
  const { getWeekById } = useWeeksStore();
  const { goals } = useGoalsStore();
  const { handleSave, isSaving } = useSessionActions();
  const [ keepAwakeEnabled, setKeepAwakeEnabled ] = useState<boolean>( false );

  // États de la session
  const [ sessionState, setSessionState ] = useState<SessionState>( "summary" );
  const [ currentSeriesIndex, setCurrentSeriesIndex ] = useState( 0 );
  const [ sessionStartTime, setSessionStartTime ] = useState<Date>();
  const [ sessionDuration, setSessionDuration ] = useState<number>();
  const [ sessionNote, setSessionNote ] = useState<string>( "" );
  const [ performances, setPerformances ] = useState<Performances>( {} );

  // Récupération de l’entraînement
  // Si l'id n'est pas fourni on retourne directement à l'accueil
  useEffect( () => {
    if ( !id ) {
      router.push( "/(tabs)" );
      return;
    }

    getBoolean( STORAGE_KEYS.KEEP_AWAKE_ENABLED, false ).then( setKeepAwakeEnabled );

    const load = async () => {
      try {
        await fetchTrainingById( id as string );
      } catch {
        showAlert.error( "Impossible de charger l'entraînement", () =>
          router.push( "/weeks" )
        );
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ id ] );

  useConditionalKeepAwake( keepAwakeEnabled );

  /**
   * Permet de lancer la séance après le résumé de début
   */
  const handleSessionStart = () => {
    setSessionState( "active" );
    setSessionStartTime( new Date() );
    setCurrentSeriesIndex( 0 );
  };

  const handleSeriesComplete = () => {
    if ( !currentTraining?.series ) return;

    // Passer à la série suivante
    if ( currentSeriesIndex < currentTraining.series.length - 1 ) {
      setCurrentSeriesIndex( prev => prev + 1 );
    } else {
      // Toutes les séries sont terminées
      const endTime = new Date();
      const durationMs = endTime.getTime() - sessionStartTime!.getTime();
      setSessionDuration( Math.floor( durationMs / 1000 ) );

      setSessionState( "completed" );
    }
  };

  const handleSessionEnd = async () => {
    if ( !currentTraining || !sessionDuration ) return;

    // Ajout de la date du jour dans la clé TRAINING_DONE
    const today = new Date().toISOString().split( "T" )[ 0 ];
    setValue( STORAGE_KEYS.TRAINING_DONE, today );

    const trainingWeek = getWeekById( currentTraining.week );

    const tempSession = {
      duration: sessionDuration,
      note: sessionNote,
      trainingId: currentTraining.$id,
      trainingName: currentTraining.name,
      weekName: trainingWeek?.name ?? ""
    };

    const result = await handleSave( {
      session: tempSession,
      performances,
      onSuccess: () => router.push( "/(tabs)" ),
    } );

    if ( !result?.success ) return;
  };

  const renderCompleted = () => {
    if ( !currentTraining || !sessionDuration ) {
      return (
        <Text className="text-center text-secondary text-lg my-5">
          Une erreur est survenue
        </Text>
      );
    }
    return (
      <>
        <PageHeader
          title={ `Session : ${currentTraining.name}` }
          onBackPress={ handleSessionEnd }
        />
        <ScrollView
          className="flex-1"
          contentContainerStyle={ { flexGrow: 1 } }
          showsVerticalScrollIndicator={ false }
        >
          <SessionRecap
            training={ currentTraining }
            sessionDuration={ sessionDuration }
            handleSetSessionNote={ setSessionNote }
            performances={ performances }
          />
        </ScrollView>
      </>
    );
  };

  return (
    <View className="flex-1">
      { !currentTraining ? (
        <View className='flex-1 items-center justify-center'>
          <ActivityIndicator size='large' color='#0000ff' />
          <Text>Chargement...</Text>
        </View>
      ) : (
        <View className='flex-1 bg-background'>
          { sessionState === "summary" && (
            <>
              <PageHeader
                title={ `Session : ${currentTraining.name }` }
              />
              <ScrollView
                className="flex-1"
                contentContainerStyle={ { flexGrow: 1 } }
                showsVerticalScrollIndicator={ false }
              >
                <SessionSummary training={ currentTraining } goals={ goals } />
              </ScrollView>
            </>
          ) }

          { sessionState === "active" && currentTraining?.series && (
            <View className="flex-1">
              <SessionActive
                series={ currentTraining.series }
                currentIndex={ currentSeriesIndex }
                onSeriesComplete={ handleSeriesComplete }
                setPerformances={ setPerformances }
              />
            </View>
          ) }

          { sessionState === "completed" && renderCompleted() }

          { sessionState === "summary" && (
            <View className="px-5 py-3">
              <CustomButton
                onPress={ handleSessionStart }
                title="C'est parti !"
              />
            </View>
          ) }

          { sessionState === "completed" && (
            <View className="px-5 py-3">
              <CustomButton
                onPress={ handleSessionEnd }
                title="Terminer la séance"
                isLoading={ isSaving }
              />
            </View>
          ) }
        </View>
      ) }
    </View>
  );
}