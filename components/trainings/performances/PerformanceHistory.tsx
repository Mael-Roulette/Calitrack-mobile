import { getExerciseImage } from "@/constants/exercises";
import { Performance } from "@/types";
import { formatSecondsDuration } from "@/utils/string";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, View } from "react-native";

export default function PerformanceHistory ( {
  performances,
}: {
  performances: Performance[]; // tous les sets d'un même exercice, dans l'ordre
} ) {
  if ( !performances || performances.length === 0 ) return null;

  // On prend les infos "communes" (exercice / série) sur la première performance
  const first = performances[ 0 ];
  const imageSource = first.exerciseImage
    ? getExerciseImage( first.exerciseImage )
    : null;

  return (
    <View className="border border-secondary rounded-xl p-4 mb-3 bg-background">
      <View className="flex-row items-center gap-3 flex-1">
        <View className="w-12 h-12 bg-secondary rounded-lg items-center justify-center overflow-hidden">
          {imageSource ? (
            <Image
              source={ imageSource }
              style={ { width: "100%", height: "100%" } }
              contentFit="contain"
            />
          ) : (
            <Feather name="activity" size={ 20 } color="#FFF9F7" />
          )}
        </View>

        <View className="flex-1">
          <Text
            className="font-sregular text-primary text-base"
            numberOfLines={ 1 }
          >
            {first.exerciseName}
          </Text>
          <Text className="label-text text-sm">
            {performances.length}x {first.targetValue} répétition(s)
          </Text>
        </View>
      </View>

      <View className="flex-row gap-2 mt-4">
        <View className="flex-1 items-center gap-1">
          <Text className="text text-xl" numberOfLines={ 1 }>
            RPE
          </Text>
          <View
            className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
            style={ { height: 44 } }
          >
            <Text className="text">{first.rpe}</Text>
          </View>
        </View>

        <View className="flex-1 items-center gap-1">
          <Text className="text text-xl" numberOfLines={ 1 }>
            Poids
          </Text>
          <View
            className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
            style={ { height: 44 } }
          >
            <Text className="text">{first.weight}</Text>
          </View>
        </View>

        <View className="flex-1 items-center gap-1">
          <Text className="text text-xl" numberOfLines={ 1 }>
            Repos
          </Text>
          <View
            className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
            style={ { height: 44 } }
          >
            <Text className="text">
              {formatSecondsDuration( first.restTime ?? 0, false )}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2 mt-4 flex-wrap">
        <Text className="title-2 w-full">Performances</Text>

        {performances.map( ( performance, index ) => (
          <View
            key={ performance.$id }
            className="items-center gap-1"
            style={ { width: "30%", marginBottom: index >= 3 ? 8 : 0 } }
          >
            <Text className="text text-xl" numberOfLines={ 1 }>
              Set {index + 1}
            </Text>
            <View
              className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
              style={ { height: 44 } }
            >
              <Text className="text">
                {performance.achievedValue} / {performance.targetValue} rep(s)
              </Text>
            </View>
          </View>
        ) )}
      </View>
    </View>
  );
}