import CustomInput from "@/components/ui/CustomInput";
import { Performances, Training } from "@/types";
import { formatSecondsDuration } from "@/utils/string";
import { Text, View } from "react-native";
import PerformanceRecap from "../performances/PerformanceRecap";

interface SessionContentProps {
  sessionDuration: number,
  training: Training,
  performances: Performances | Performance[],
}

const SessionContent = ( { sessionDuration, training, performances }: SessionContentProps ) => {
  return (
    <View>
      <View className="flex-row gap-1 items-center mb-4">
        <Text className="title-2">Durée : </Text>
        <Text className="text-lg-custom">{ formatSecondsDuration( sessionDuration, true, false ) }</Text>
      </View>

      <CustomInput
        label="Note personelle (facultatif)"
        multiline
        numberOfLines={ 4 }
        customStyles="h-32"
      />

      <Text className="title mt-4">Mes performances</Text>
      <View className="mt-2">
        {training.series?.map( ( serie ) => (
          <PerformanceRecap
            key={ serie.$id }
            serie={ serie }
            performances={ performances?.[ serie.$id ] }
          />
        ) )}
      </View>
    </View>
  );
};

export default SessionContent;