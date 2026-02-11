import { getExerciseImage } from "@/constants/exercises";
import { Exercise } from "@/types";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ExerciseItemProps {
  exercise: Exercise;
  onPress: () => void;
}

export default function ExerciseItem ( { exercise, onPress }: ExerciseItemProps ) {
  return (
    <TouchableOpacity className="relative overflow-hidden aspect-square bg-secondary rounded-2xl flex-col justify-between" onPress={ onPress }>
      { exercise.image && (
        <Image
          source={ getExerciseImage( exercise.image ) }
          style={ { width: "100%", height: "100%" } }
          className="absolute top-0 left-0"
        />
      ) }
      <View className="m-2 px-3 py-1 rounded-full bg-background self-start">
        <Text className="text">{ exercise.type }</Text>
      </View>

      <View className="bg-primary/60 p-3">
        <Text className="z-10 text text-background text-ellipsis line-clamp-1">{exercise.name}</Text>
      </View>
    </TouchableOpacity>
  );
}