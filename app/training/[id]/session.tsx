import PageHeader from "@/components/headers/PageHeader";
import SessionActive from "@/components/trainings/session/SessionActive";
import SessionRecap from "@/components/trainings/session/SessionRecap";
import SessionSummary from "@/components/trainings/session/SessionSummary";
import CustomButton from "@/components/ui/CustomButton";
import { useGoalsStore } from "@/store";
import useTrainingsStore from "@/store/training.store";
import { showAlert } from "@/utils/alert";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Les différents états de la session
type SessionState = "summary" | "active" | "completed";

export default function SessionPage () {
  const { id } = useLocalSearchParams();
  const { currentTraining, fetchTrainingById } = useTrainingsStore();
  const { goals } = useGoalsStore();
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

  /**
   * Permet de quitter la séance, elle n'est pas sauvegardé
   */
  const handleQuitTraining = () => {
    console.log( "quit" );
    // Ajouter popup de confirmation
  };

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
          <>
            <PageHeader
              title={ `Session : ${currentTraining.name }` }
              onBackPress={ handleQuitTraining }
            />
            <ScrollView className="bg-background flex-1">
              { sessionState === "summary" && (
                <SessionSummary training={ currentTraining } goals={ goals } />
              ) }

              { sessionState === "active" && currentTraining?.series && (
                <SessionActive
                  series={ currentTraining.series }
                  currentIndex={ currentSeriesIndex }
                  onSeriesComplete={ handleSeriesComplete }
                />
						) }

            </ScrollView>
            <View className='px-5 py-3 bg-background'>
              { sessionState === "summary" && (
                <CustomButton
                  onPress={ handleSessionStart }
                  title="C'est parti !"
                />
              ) }

              { sessionState === "completed" && (
                <CustomButton
                  onPress={ handleSessionEnd }
                  title="Terminer la séance"
                  isLoading={ isFinishing }
                />
              ) }

						{ sessionState === "completed" && currentTraining && sessionStartTime && (
							<SessionRecap
								training={ currentTraining }
								startTime={ sessionStartTime }
								endTime={ new Date() }
							/>
						) }
            </View>
          </>
        ) }
    </View>
  );
}