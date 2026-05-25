import { Text, View } from "react-native";
import PreviousSessionCard from "../trainings/session/PreviousSessionCard";

const HistorySection = () => {
  
  return (
    <View className="px-5 py-3">
      <Text className="title mb-5">Historique</Text>
      <PreviousSessionCard />
    </View>
  );
};

export default HistorySection;