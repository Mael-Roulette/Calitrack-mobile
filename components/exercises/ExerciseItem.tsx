import { getExerciseImage } from "@/constants/exercises";
import { Exercise } from "@/types";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
      {imageSource && (
        <Image
          source={ imageSource }
          style={ { width: "100%", height: "100%" } }
          className="absolute top-0 left-0"
          resizeMode="cover"
        />
      )}
      <View className="m-2 px-3 py-1 rounded-full bg-background self-start">
        <Text className="text">{ exercise.type }</Text>
      </View>

      <View className="bg-primary/60 p-3">
        <Text className="label-text text-background" numberOfLines={ 1 }>{exercise.name}</Text>
      </View>
    </TouchableOpacity>
  );
}