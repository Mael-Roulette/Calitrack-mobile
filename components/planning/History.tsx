import { Session } from "@/types/session";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import PreviousSessionCard from "../trainings/session/PreviousSessionCard";

interface HistorySectionProps {
  sessions: Session[],
  isLoading: boolean,
  error: string | undefined,
}

const HistorySection = ( { sessions, isLoading, error }: HistorySectionProps ) => {
  if ( isLoading ) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  if ( error ) {
    return (
      <View className="px-5 py-3">
        <Text className="title mb-5">Historique</Text>
        <Text className="text-red-500">{ error }</Text>
      </View>
    );
  }

  return (
    <View className="px-5 py-3 flex-1">
      <Text className="title mb-5">Historique</Text>

      { sessions.length === 0 ? (
        <Text className="text-secondary text-center mt-10">
          Aucune session enregistrée pour le moment.
        </Text>
      ) : (
        <FlatList
          data={ sessions }
          keyExtractor={ ( item ) => item.$id }
          renderItem={ ( { item } ) => <PreviousSessionCard session={ item } /> }
          showsVerticalScrollIndicator={ false }
        />
      ) }
    </View>
  );
};

export default HistorySection;