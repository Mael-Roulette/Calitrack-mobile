import CustomInput from "@/components/ui/CustomInput";
import { Performances, Training } from "@/types";
import { formatSecondsDuration } from "@/utils/string";
import { Dispatch, SetStateAction } from "react";
import { Text, View } from "react-native";
import PerformanceRecap from "../performances/PerformanceRecap";

interface SessionContentProps {
  sessionDuration: number,
  handleSetSessionNote: Dispatch<SetStateAction<string>>;
  training: Training,
  performances: Performances
}


const SessionContent = ( { sessionDuration, handleSetSessionNote, training, performances }: SessionContentProps ) => {
  return (
    <View>
      <View className="flex-row gap-1 items-center mb-4">
        <Text className="title-2">Durée : </Text>
        <Text className="text-lg-custom">{ formatSecondsDuration( sessionDuration, true, false ) }</Text>
      </View>

      <CustomInput
        label="Note personnelle (facultatif)"
        multiline
        numberOfLines={ 4 }
        customStyles="h-32 mb-4"
        onChangeText={ handleSetSessionNote }
      />

      <Text className="title">Mes performances</Text>
      <View className="mt-2 mb-5">
        {training.series?.map( ( item ) => (
          <PerformanceRecap
            key={ item.$id }
            series={ item }
            performances={ performances?.[ item.$id ] }
          />
        ) )}
      </View>
    </View>
  );
};

export default SessionContent;