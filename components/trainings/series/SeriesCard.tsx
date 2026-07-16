import { getExerciseImage } from "@/constants/exercises";
import { Series } from "@/types";
import { formatSecondsDuration } from "@/utils/string";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export default function seriesCard ( { series }: { series: Series } ) {
  const isHold = series.exercise.format === "hold";
  const imageSource = series.exercise.image
    ? getExerciseImage( series.exercise.image )
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
            { series.exercise.name }
          </Text>
          <Text className="label-text text-sm">
            { series.sets }x{ " " }
            { isHold
              ? `${ series.targetValue } seconde(s)`
              : `${ series.targetValue } répétition(s)` }
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
            <Text className="text">{ series.rpe }</Text>
          </View>
        </View>

        <View className="flex-1 items-center gap-1">
          <Text className="text text-xl" numberOfLines={ 1 }>Poids</Text>
          <View
            className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
            style={ { height: 44 } }
          >
            <Text className="text">{ series.weight }</Text>
          </View>
        </View>

        <View className="flex-1 items-center gap-1">
          <Text className="text text-xl" numberOfLines={ 1 }>Repos</Text>
          <View
            className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
            style={ { height: 44 } }
          >
            <Text className="text">{ formatSecondsDuration( series.restTime ?? 0, false ) }</Text>
          </View>
        </View>
      </View>
    </View>
  );
}