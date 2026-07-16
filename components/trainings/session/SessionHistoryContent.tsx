import { Session } from "@/types";
import { formatSecondsDuration } from "@/utils/string";
import { Text, View } from "react-native";


const SessionHistoryContent = ( { session }: { session: Session} ) => {
  return (
    <View>
      <View className="flex-row gap-1 items-center mb-4">
        <Text className="title-2">Durée : </Text>
        <Text className="text-lg-custom">{ formatSecondsDuration( session.duration, true, false ) }</Text>
      </View>

      <View className="mb-4">
        <Text className="text text-2xl font-calsans">
          Note personnelle :
        </Text>
        <Text className="text text-xl">{ session.note }</Text>
      </View>

      <Text className="title">Mes performances</Text>
      <View className="mt-2 mb-5">
        { session.performances.map( ( performance ) =>
          <Text key={ performance.$id }>{ performance.exerciseName }</Text>
        )}
      </View>
    </View>
  );
};

export default SessionHistoryContent;