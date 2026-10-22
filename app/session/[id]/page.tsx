import PageHeader from "@/components/headers/PageHeader";
import SessionHistoryContent from "@/components/trainings/session/SessionHistoryContent";
import { getSessionById } from "@/lib/session.appwrite";
import { Session } from "@/types/session";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const SessionPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [ session, setSession ] = useState<Session | null>( null );
  const [ isLoading, setIsLoading ] = useState( true );

  useEffect( () => {
    if ( !id ) {
      router.replace( "/planning" );
      return;
    }

    let cancelled = false;

    const loadSession = async () => {
      try {
        const data = await getSessionById( id );
        if ( !cancelled ) setSession( data );
      } catch ( error ) {
        console.error( "Erreur chargement session:", error );
        if ( !cancelled ) router.replace( "/planning" );
      } finally {
        if ( !cancelled ) setIsLoading( false );
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [ id ] );

  if ( isLoading ) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if ( !session ) return null;

  return (
    <View className="flex-1 bg-background">
      <PageHeader title={ session.trainingName } />
      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={ { flexGrow: 1 } }
        showsVerticalScrollIndicator={ false }
      >
        <SessionHistoryContent session={ session } />
      </ScrollView>
    </View>
  );
};

export default SessionPage;