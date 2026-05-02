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
  const [performances, setPerformances] = useState<Performances>({});
  const [ isFinishing, setIsFinishing ] = useState<boolean>( false );

  // Récupération de l'entrainement
  // Si l'id n'est pas fourni on retourne directement à l'accueil
  if ( !id ) router.push( "/(tabs)" );

  useEffect( () => {
    const load = async () => {
      try {
        await fetchTrainingById( id as string );
      } catch {
        showAlert.error( "Impossible de charger l'entrainement", () => router.push( "/weeks" ) );
      }
    };
    load();
  }, [ id ] );


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
			setSessionState( "completed" );
		}
	};

  const handleSessionEnd = () => {

  }

  	// États de la session
	const [ sessionState, setSessionState ] = useState<SessionState>( "summary" );
	const [ currentSeriesIndex, setCurrentSeriesIndex ] = useState( 0 );
	const [ sessionStartTime, setSessionStartTime ] = useState<Date>();

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

            { sessionState === "completed" && currentTraining && sessionStartTime && (
							<>
                <PageHeader
                  title={ `Session : ${currentTraining.name }` }
                  onBackPress={ handleSessionEnd }
                />
                <ScrollView
                  className="flex-1"
                  contentContainerStyle={{ flexGrow: 1 }}
                  showsVerticalScrollIndicator={false}
                >
                  <SessionRecap
                    training={currentTraining}
                    startTime={sessionStartTime}
                    endTime={new Date()}
                    performances={performances}
                  />
                </ScrollView>
              </>
						) }


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