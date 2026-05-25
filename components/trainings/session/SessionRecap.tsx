import { Training } from "@/types";
import { Performances } from "@/types/session";
import { Text, View } from "react-native";
import SessionContent from "./SessionContent";

interface SessionRecapProps {
  training: Training;
  sessionDuration: number;
  performances: Performances;
}

const SessionRecap = ( { training, sessionDuration, performances }: SessionRecapProps ) => {
  return (
    <View className="flex-1 px-5 pt-8 bg-background">
      <Text className="title text-center mb-4">Résumé de la séance</Text>
      <SessionContent
        sessionDuration={ sessionDuration }
        training={ training }
        performances={ performances }
      />
    </View>
  );
};

export default SessionRecap;