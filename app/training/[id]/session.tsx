import PageHeader from "@/components/headers/PageHeader";
import SessionActive from "@/components/trainings/session/SessionActive";
import SessionRecap from "@/components/trainings/session/SessionRecap";
import SessionSummary from "@/components/trainings/session/SessionSummary";
import CustomButton from "@/components/ui/CustomButton";
import { useGoalsStore } from "@/store";
import useTrainingsStore from "@/store/training.store";
import { Performances } from "@/types/session";
import { showAlert } from "@/utils/alert";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Les différents états de la session
type SessionState = "summary" | "active" | "completed";

export default function Session () {
  const { id } = useLocalSearchParams();
  const { currentTraining, fetchTrainingById } = useTrainingsStore();
  const { goals } = useGoalsStore();

  // États de la session
	const [ sessionState, setSessionState ] = useState<SessionState>( "summary" );
	const [ currentSeriesIndex, setCurrentSeriesIndex ] = useState( 0 );
	const [ sessionStartTime, setSessionStartTime ] = useState<Date>();
	const [ sessionEndTime, setSessionEndTime ] = useState<Date>();
  const [ sessionDuration, setSessionDuration ] = useState<number>();
  const [performances, setPerformances] = useState<Performances>({});
  const [ isFinishing, setIsFinishing ] = useState<boolean>( false );

  // Récupération de l'entrainement
  // Si l'id n'est pas fourni on retourne directement à l'accueil
  useEffect(() => {
    if (!id) {
      router.push("/(tabs)");
      return;
    }
    const load = async () => {
      try {
        await fetchTrainingById(id as string);
      } catch {
        showAlert.error("Impossible de charger l'entrainement", () =>
          router.push("/weeks")
        );
      }
    };
    load();
  }, [id]);

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
      setSessionDuration(Math.floor(durationMs / 1000));
      setSessionEndTime(endTime);

			setSessionState( "completed" );
		}
	};

  const handleSessionEnd = async () => {
    try {
      setIsFinishing(true);
      // TODO: sauvegarder la session
      router.push("/(tabs)");
    } catch {
      showAlert.error("Impossible de terminer la séance", () => {});
    } finally {
      setIsFinishing(false);
    }
  };

  const renderCompleted = () => {
    if (!currentTraining || !sessionDuration) {
      return (
        <Text className="text-center text-secondary text-lg my-5">
          Une erreur est survenue
        </Text>
      );
    }
    return (
      <>
        <PageHeader
          title={`Session : ${currentTraining.name}`}
          onBackPress={handleSessionEnd}
        />
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <SessionRecap
            training={currentTraining}
            sessionDuration={sessionDuration}
            performances={performances}
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
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                    <SessionSummary training={ currentTraining } goals={ goals } />
                </ScrollView>
              </>
            ) }

            { sessionState === "active" && currentTraining?.series && (
              <View className="flex-1">
                <SessionActive
                  series={currentTraining.series}
                  currentIndex={currentSeriesIndex}
                  onSeriesComplete={handleSeriesComplete}
                  performances={performances}
                  setPerformances={setPerformances}
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
                    isLoading={ isFinishing }
                  />
                </View>
              ) }
          </View>
        ) }
    </View>
  );
}