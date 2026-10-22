import SessionActive from "@/components/trainings/session/SessionActive";
import SessionCompleted from "@/components/trainings/session/SessionCompleted";
import SessionIntro from "@/components/trainings/session/SessionIntro";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { useSessionActions } from "@/hooks/actions/session/useSessionAction";
import { useSessionPersistence } from "@/hooks/actions/session/useSessionPersistence";
import { useSessionRun } from "@/hooks/actions/session/useSessionRun";
import { useConditionalKeepAwake } from "@/hooks/useConditionalKeepAwake";
import { useGoalsStore } from "@/store";
import useTrainingsStore from "@/store/training.store";
import useWeeksStore from "@/store/week.store";
import { getBoolean, setValue } from "@/utils/local-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Session () {
  const { id, resume } = useLocalSearchParams<{ id: string; resume?: string }>();
  const { currentTraining, fetchTrainingById } = useTrainingsStore();
  const { getWeekById } = useWeeksStore();
  const { goals } = useGoalsStore();
  const { handleSave, isSaving } = useSessionActions();
  const [ keepAwake, setKeepAwake ] = useState( false );

  const series = currentTraining?.series ?? [];
  const run = useSessionRun( series );

  const { clear } = useSessionPersistence( {
    trainingId: id,
    ready: currentTraining?.$id === id,
    resume: resume === "true",
    seriesCount: series.length,
    snapshot: run.snapshot,
    onRestore: run.restore,
  } );

  useConditionalKeepAwake( keepAwake );

  useEffect( () => {
    if ( !id ) {
      router.push( "/(tabs)" );
      return;
    }
    getBoolean( STORAGE_KEYS.KEEP_AWAKE_ENABLED, false ).then( setKeepAwake );
    fetchTrainingById( id );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ id ] );

  const handleSessionEnd = async () => {
    if ( !currentTraining || run.duration === undefined ) return;

    setValue( STORAGE_KEYS.TRAINING_DONE, new Date().toISOString().split( "T" )[ 0 ] );

    const result = await handleSave( {
      session: {
        duration: run.duration,
        note: run.note,
        trainingId: currentTraining.$id,
        trainingName: currentTraining.name,
        weekName: getWeekById( currentTraining.week )?.name ?? "",
      },
      performances: run.performances,
      onSuccess: () => router.push( "/(tabs)" ),
    } );

    if ( result?.success ) await clear();
  };

  if ( !currentTraining ) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      { run.sessionState === "summary" && (
        <SessionIntro training={ currentTraining } goals={ goals } onStart={ run.start } />
      ) }

      { run.sessionState === "active" && run.currentSeries && (
        <SessionActive
          series={ run.currentSeries }
          seriesNumber={ run.progress.seriesIndex + 1 }
          totalSeries={ series.length }
          currentSet={ run.progress.set }
          activeState={ run.progress.activeState }
          nextExercise={ run.nextExerciseName }
          onSetComplete={ run.completeSet }
          onRestComplete={ run.completeRest }
        />
      ) }

      { run.sessionState === "completed" && run.duration !== undefined && (
        <SessionCompleted
          training={ currentTraining }
          duration={ run.duration }
          performances={ run.performances }
          onNoteChange={ run.setNote }
          onEnd={ handleSessionEnd }
          isSaving={ isSaving }
        />
      ) }
    </View>
  );
}