import PageHeader from "@/components/headers/PageHeader";
import SessionContent from "@/components/trainings/session/SessionContent";
import useSessionsStore from "@/store/session.store";
import { Performances } from "@/types";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const SessionPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSessionById } = useSessionsStore();
  const session = getSessionById( id );

  if ( !id || !session ) {
    router.replace( "/planning" );
  }

  console.log( session?.performances );

  const performances: Performances = ( session!.performances ?? [] ).reduce(
    ( acc, perf ) => {
      const serieId = perf.series;
      if ( !acc[ serieId ] ) acc[ serieId ] = {};
      acc[ serieId ][ 1 ] = perf.achievedValue;
      return acc;
    },
  {} as Performances
  );

  return(
    <View className="flex-1 bg-background">
      <PageHeader
        title={ session!.training.name }
      />
      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={ { flexGrow: 1 } }
        showsVerticalScrollIndicator={ false }
      >
        <SessionContent
          sessionDuration={ session!.duration }
          note={ session!.note }
          training={ session!.training }
          performances={ performances }
          isRecap={ false }
        />
      </ScrollView>
    </View>
  );
};

export default SessionPage;