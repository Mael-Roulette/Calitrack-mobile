import { Training } from "@/types";
import { Performances } from "@/types/session";
import { Dispatch, SetStateAction } from "react";
import { Text, View } from "react-native";
import SessionContent from "./SessionRecapContent";

interface SessionRecapProps {
  training: Training;
  sessionDuration: number;
  handleSetSessionNote: Dispatch<SetStateAction<string>>;
  performances: Performances;
}

const SessionRecap = ( { training, sessionDuration, handleSetSessionNote, performances }: SessionRecapProps ) => {
  return (
    <View className="flex-1 px-5 pt-8 bg-background">
      <Text className="title text-center mb-4">Résumé de la séance</Text>
      <SessionContent
        handleSetSessionNote={ handleSetSessionNote }
        sessionDuration={ sessionDuration }
        training={ training }
        performances={ performances }
      />
    </View>
  );
};

export default SessionRecap;