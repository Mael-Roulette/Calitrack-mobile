import PageHeader from "@/components/headers/PageHeader";
import SessionSummary from "@/components/trainings/session/SessionSummary";
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
            <ScrollView className="bg-background">
              <SessionSummary training={ currentTraining } goals={ goals } />
            </ScrollView>
          </>
        ) }
    </View>
  );
}