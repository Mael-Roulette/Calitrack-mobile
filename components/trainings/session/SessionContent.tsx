import CustomInput from "@/components/ui/CustomInput";
import { Performances, Training } from "@/types";
import { formatSecondsDuration } from "@/utils/string";
import { Text, View } from "react-native";
import PerformanceRecap from "../performances/PerformanceRecap";

interface SessionContentProps {
  sessionDuration: number,
  note?: string,
  training: Training,
  performances: Performances,
  isRecap: boolean,
}


const SessionContent = ( { sessionDuration, note, training, performances, isRecap }: SessionContentProps ) => {
  console.log( "training", training );
  console.log( "series", training?.series );
  
  return (
    <View>
      <View className="flex-row gap-1 items-center mb-4">
        <Text className="title-2">Durée : </Text>
        <Text className="text-lg-custom">{ formatSecondsDuration( sessionDuration, true, false ) }</Text>
      </View>

      {isRecap ? (
        <CustomInput
          label="Note personelle (facultatif)"
          multiline
          numberOfLines={ 4 }
          customStyles="h-32 mb-4"
        />
      ) : (
        note?.trim() && (
          <View className="mb-4">
            <Text className="text text-2xl font-calsans">
              Note personnelle :
            </Text>
            <Text className="text text-xl">{note}</Text>
          </View>
        )
      )}

      <Text className="title">Mes performances</Text>
      <View className="mt-2 mb-5">
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