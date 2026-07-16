import PageHeader from "@/components/headers/PageHeader";
import SessionHistoryContent from "@/components/trainings/session/SessionHistoryContent";
import useSessionsStore from "@/store/session.store";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const SessionPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSessionById } = useSessionsStore();
  const session = getSessionById( id );

  if ( !id || !session ) {
    router.replace( "/planning" );
    return null;
  }

  return(
    <View className="flex-1 bg-background">
      <PageHeader
        title={ session.trainingName }
      />
      <ScrollView
        className="flex-1 px-5 pt-5"
        contentContainerStyle={ { flexGrow: 1 } }
        showsVerticalScrollIndicator={ false }
      >
        <SessionHistoryContent
          session={ session }
        />
      </ScrollView>
    </View>
  );
};

export default SessionPage;