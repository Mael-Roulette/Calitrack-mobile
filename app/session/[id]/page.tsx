import SessionContent from "@/components/trainings/session/SessionContent";
import useSessionsStore from "@/store/session.store";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const SessionPage = () => {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const { getSessionById } = useSessionsStore();
  const session = getSessionById( sessionId );

  return(
    <View>
      <SessionContent
        sessionDuration={ session!.duration }
        training={ session!.training }
        performances={ session!.performance }
      />
    </View>
  );
};

export default SessionPage;