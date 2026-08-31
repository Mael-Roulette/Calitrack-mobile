import PageHeader from "@/components/headers/PageHeader";
import SessionActive, { ActiveState } from "@/components/trainings/session/SessionActive";
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
import { getBoolean, getValue, removeValue, setValue } from "@/utils/local-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

type SessionState = "summary" | "active" | "completed";

interface SessionProgress {
  trainingId: string;
  sessionState: SessionState;
  currentSeriesIndex: number;
  currentSet: number;
  activeState: ActiveState;
  sessionStartTime: string; // ISO
  sessionDuration?: number;
  sessionNote: string;
  performances: Performances;
}

export default function Session () {
  const { id, resume } = useLocalSearchParams();
  const { currentTraining, fetchTrainingById } = useTrainingsStore();
  const { getWeekById } = useWeeksStore();
  const { goals } = useGoalsStore();
  const { handleSave, isSaving } = useSessionActions();
  const [ keepAwakeEnabled, setKeepAwakeEnabled ] = useState<boolean>( false );

  const [ sessionState, setSessionState ] = useState<SessionState>( "summary" );
  const [ currentSeriesIndex, setCurrentSeriesIndex ] = useState( 0 );
  const [ currentSet, setCurrentSet ] = useState( 1 );
  const [ activeState, setActiveState ] = useState<ActiveState>( "series" );
  const [ sessionStartTime, setSessionStartTime ] = useState<Date>();
  const [ sessionDuration, setSessionDuration ] = useState<number>();
  const [ sessionNote, setSessionNote ] = useState<string>( "" );
  const [ performances, setPerformances ] = useState<Performances>( {} );

  // Évite que l'effet de reset de série n'écrase une séance qu'on vient de restaurer
  const justRestored = useRef( false );
  const hasCheckedResume = useRef( false );

  useEffect( () => {
    if ( !id ) {
      router.push( "/(tabs)" );
      return;
    }

    getBoolean( STORAGE_KEYS.KEEP_AWAKE_ENABLED, false ).then( setKeepAwakeEnabled );

    const load = async () => {
      try {
        await fetchTrainingById( id as string );
        await checkForSavedProgress();
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
   * Vérifie si une séance interrompue existe pour cet entraînement,
   * et propose à l'utilisateur de la reprendre.
   */
  const checkForSavedProgress = async () => {
    if ( hasCheckedResume.current ) return;
    hasCheckedResume.current = true;

    if ( resume !== "true" ) return;

    const raw = await getValue( STORAGE_KEYS.TRAINING_IN_PROGRESS );
    if ( !raw ) return;

    let saved: SessionProgress;
    try {
      saved = JSON.parse( raw );
    } catch {
      await removeValue( STORAGE_KEYS.TRAINING_IN_PROGRESS );
      return;
    }

    if ( saved.trainingId !== id ) return;

    justRestored.current = true;
    setSessionState( saved.sessionState );
    setCurrentSeriesIndex( saved.currentSeriesIndex );
    setCurrentSet( saved.currentSet );
    setActiveState( saved.activeState );
    setSessionStartTime( new Date( saved.sessionStartTime ) );
    setSessionDuration( saved.sessionDuration );
    setSessionNote( saved.sessionNote );
    setPerformances( saved.performances );
  };

  /**
   * Sauvegarde continue de la progression tant que la séance
   * est active ou en attente de validation finale.
   */
  useEffect( () => {
    if ( !id || sessionState === "summary" ) return;

    const progress: SessionProgress = {
      trainingId: id as string,
      sessionState,
      currentSeriesIndex,
      currentSet,
      activeState,
      sessionStartTime: ( sessionStartTime ?? new Date() ).toISOString(),
      sessionDuration,
      sessionNote,
      performances,
    };

    setValue( STORAGE_KEYS.TRAINING_IN_PROGRESS, JSON.stringify( progress ) );
  }, [ sessionState, currentSeriesIndex, currentSet, activeState, sessionStartTime, sessionDuration, sessionNote, performances, id ] );

  /**
   * Reset du set/état actif à chaque changement de série,
   * sauf juste après une restauration.
   */
  useEffect( () => {
    if ( justRestored.current ) {
      justRestored.current = false;
      return;
    }
    setCurrentSet( 1 );
    setActiveState( "series" );
  }, [ currentSeriesIndex ] );

  const handleSessionStart = () => {
    setSessionState( "active" );
    setSessionStartTime( new Date() );
    setCurrentSeriesIndex( 0 );
  };

  const handleSeriesComplete = () => {
    if ( !currentTraining?.series ) return;

    if ( currentSeriesIndex < currentTraining.series.length - 1 ) {
      setCurrentSeriesIndex( prev => prev + 1 );
    } else {
      const endTime = new Date();
      const durationMs = endTime.getTime() - sessionStartTime!.getTime();
      setSessionDuration( Math.floor( durationMs / 1000 ) );
      setSessionState( "completed" );
    }
  };

  const handleSessionEnd = async () => {
    if ( !currentTraining || !sessionDuration ) return;

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

    // Séance enregistrée : on supprime la sauvegarde locale
    await removeValue( STORAGE_KEYS.TRAINING_IN_PROGRESS );
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
                currentSet={ currentSet }
                activeState={ activeState }
                onSeriesComplete={ handleSeriesComplete }
                setPerformances={ setPerformances }
                setCurrentSet={ setCurrentSet }
                setActiveState={ setActiveState }
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