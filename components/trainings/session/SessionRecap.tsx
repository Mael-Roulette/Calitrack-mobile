import CustomInput from "@/components/ui/CustomInput";
import { Training } from "@/types";
import { Performances } from "@/types/session";
import { formatSecondsDuration } from "@/utils/string";
import { Text, View } from "react-native";

interface SessionRecapProps {
  training: Training;
  startTime: Date;
  endTime: Date;
  performances: Performances;
}

const SessionRecap = ( { training, startTime, endTime, performances }: SessionRecapProps ) => {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationSeconds = Math.floor( durationMs / 1000 );

  return (
    <View className="flex-1 px-5 pt-8 bg-background">
      <Text className="title text-center mb-4">Résumé de la séance</Text>
      <View className="flex-row gap-1 items-center mb-4">
        <Text className="title-2">Durée : </Text>
        <Text className="text-lg-custom">{ formatSecondsDuration( durationSeconds, true, false ) }</Text>
      </View>

      <CustomInput
        label="Note personelle (facultatif)"
        multiline
        numberOfLines={ 4 }
        customStyles="h-32"
      />

      <Text className="title mt-4">Mes performances</Text>
      <View className="mt-2">
        {training.series?.map( ( serie ) => {
          const seriePerf = performances?.[ serie.$id ];

          return (
            <View key={ serie.$id } className="mb-4">
              <Text className="title-2 mb-2">{serie.exercise.name}</Text>

              <View className="flex-row flex-wrap gap-2">
                {Array.from( { length: serie.sets } ).map( ( _, i ) => {
                  const setNumber = i + 1;
                  const value = seriePerf?.[ setNumber ];

                  return (
                    <View key={ setNumber } className="border border-secondary rounded-lg px-3 py-2">
                      <Text className="text">
                        Set {setNumber}: {value ?? "-"}
                      </Text>
                    </View>
                  );
                } )}
              </View>
            </View>
          );
        } )}
      </View>
    </View>
  );
};

export default SessionRecap;