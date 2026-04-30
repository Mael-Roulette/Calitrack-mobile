import { Training } from "@/types";
import { formatMinutesDuration } from "@/utils/string";
import { Text, View } from "react-native";

interface SessionRecapProps {
    training: Training;
    startTime: Date;
    endTime: Date;
}

const SessionRecap = ( { training, startTime, endTime }: SessionRecapProps ) => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationMinutes = Math.floor( durationMs / 60000 );

  return (
    <View className="flex-1 px-5 pt-8 bg-background">
      <Text className="title text-center mb-4">Résumé de la séance</Text>
      <View className="flex-row gap-1 items-center mb-4">
        <Text className="title-2">Durée : </Text>
        <Text className="text-lg-custom">{ formatMinutesDuration( durationMinutes ) }</Text>
      </View>
    </View>
  );
};

export default SessionRecap;