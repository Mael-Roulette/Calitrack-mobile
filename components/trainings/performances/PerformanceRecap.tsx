import { getExerciseImage } from "@/constants/exercises";
import { Series } from "@/types";
import { formatSecondsDuration } from "@/utils/string";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export default function SeriesCard ( {
  serie,
  performances,
}: {
  serie: Series;
  performances?: Record<number, number>; // setNumber -> achievedValue
} ) {
  const isHold = serie.exercise.format === "hold";
  const imageSource = serie.exercise.image
    ? getExerciseImage( serie.exercise.image )
    : null;

  return (
    <View className="border border-secondary rounded-xl p-4 mb-3 bg-background">
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-12 h-12 bg-secondary rounded-lg items-center justify-center overflow-hidden">
          { imageSource ? (
            <Image
              source={ imageSource }
              style={ { width: "100%", height: "100%" } }
              contentFit="contain"
            />
          ) : (
            <Feather name="activity" size={ 20 } color="#FFF9F7" />
          ) }
        </View>

        <View className="flex-1">
          <Text
            className="font-sregular text-primary text-base"
            numberOfLines={ 1 }
          >
            { serie.exercise.name }
          </Text>
          <Text className="label-text text-sm">
            { serie.sets }x{ " " }
            { isHold
              ? `${ serie.targetValue } seconde(s)`
              : `${ serie.targetValue } répétition(s)` }
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 mt-4">
        <View className="flex-1 items-center gap-1">
          <Text className="text text-xl" numberOfLines={ 1 }>RPE</Text>
          <View
            className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
            style={ { height: 44 } }
          >
            <Text className="text">{ serie.rpe }</Text>
          </View>
        </View>

        <View className="flex-1 items-center gap-1">
          <Text className="text text-xl" numberOfLines={ 1 }>Poids</Text>
          <View
            className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
            style={ { height: 44 } }
          >
            <Text className="text">{ serie.weight }</Text>
          </View>
        </View>

        <View className="flex-1 items-center gap-1">
          <Text className="text text-xl" numberOfLines={ 1 }>Repos</Text>
          <View
            className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
            style={ { height: 44 } }
          >
            <Text className="text">{ formatSecondsDuration( serie.restTime ?? 0, false ) }</Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2 mt-4 flex-wrap">
        <Text className="title-2 w-full">Performances</Text>

        {Array.from( { length: serie.sets } ).map( ( _, index ) => {
          const setNumber = index + 1;
          const value = performances?.[ setNumber ];

          return (
            <View key={ setNumber } className="flex-1 min-w-[30%] items-center gap-1">
              <Text className="text text-xl" numberOfLines={ 1 }>
                Set {setNumber}
              </Text>
              <View
                className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
                style={ { height: 44 } }
              >
                <Text className="text">
                  {value !== undefined ? value : "-"}
                </Text>
              </View>
            </View>
          );
        } )}
      </View>
    </View>
  );
}