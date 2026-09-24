import { getExerciseImage } from "@/constants/exercises";
import { Exercise } from "@/types";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

interface ExerciseItemProps {
  exercise: Exercise;
  onPress: () => void;
}

export default function ExerciseItem ( { exercise, onPress }: ExerciseItemProps ) {
  const imageSource = getExerciseImage( exercise.image );

  return (
    <TouchableOpacity
      className="relative overflow-hidden aspect-square bg-secondary rounded-2xl flex-col justify-between"
      onPress={ onPress }
    >
      <View className="m-2 px-3 py-1 rounded-full bg-background self-start z-10">
        <Text className="text">{ exercise.type }</Text>
      </View>

      <View className="bg-primary/60 p-3 z-10">
        <Text className="label-text text-background" numberOfLines={ 1 }>{exercise.name}</Text>
      </View>

      { !exercise.isCustom ? (
        <Image
          source={ imageSource }
          style={ {
            width: "100%",
            height: "100%",
            position: "absolute"
          } }
          contentFit="cover"
          contentPosition="center"
        />
      ) : (
        <Image
          source={ exercise!.image }
          style={ {
            width: "100%",
            height: "100%",
            position: "absolute"
          } }
          contentFit="cover"
          contentPosition="center"
        />
      )}
    </TouchableOpacity>
  );
}