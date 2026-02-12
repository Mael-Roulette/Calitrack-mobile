// app/exercise/components/ExerciseItem.tsx
import { getExerciseImage } from "@/constants/exercises";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ExerciseSelectionItem = ( {
  image,
  name,
  difficulty,
  selectable = false,
  isSelected = false,
  onPress,
}: {
	image?: string,
	name: string;
	difficulty: string;
	selectable?: boolean;
	isSelected?: boolean;
	onPress?: () => void;
} ) => {
  const getDifficultyColor = ( difficulty: string ) => {
    switch ( difficulty ) {
      case "beginner":
        return { traduction: "Débutant", color: "#3b82f6" };
      case "novice":
        return { traduction: "Novice", color: "#22c55e" };
      case "intermediate":
        return { traduction: "Intermédiaire", color: "#eab308" };
      case "advanced":
        return { traduction: "Avancé", color: "#f97316" };
      case "expert":
        return { traduction: "Expert", color: "#ef4444" };
      default:
        return { traduction: "Novice", color: "#22c55e" };
    }
  };

  const difficultyInfo = getDifficultyColor( difficulty );

  return (
    <TouchableOpacity
      className={ `flex-row items-center justify-start gap-3 p-4 mb-3 rounded-md border border-secondary  ${isSelected
        ? "border-2 bg-secondary/10"
        : "bg-background"
      }` }
      onPress={ onPress }
      disabled={ !onPress }
    >
      { image && (
        <View className="h-16 aspect-square bg-secondary rounded-md p-1">
          <Image
            source={ getExerciseImage( image ) }
            style={ { width: "100%", height: "100%" } }
            contentFit="contain"
          />
        </View>
      ) }
      <View className='flex-1'>
        <Text className='text-primary font-sregular text-lg mb-1'>{ name }</Text>
        <Text className='text-sm font-medium text-primary-100 font-sregular'>
          Difficulté :{ " " }
          <Text style={ { color: difficultyInfo.color } }>
            { difficultyInfo.traduction }
          </Text>
        </Text>
      </View>

      { onPress && selectable && (
        <View
          className={ `w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? "border-secondary bg-secondary" : "border-primary-100"
          }` }
        >
          { isSelected && <Ionicons name='checkmark' size={ 16 } color='white' /> }
        </View>
      ) }
    </TouchableOpacity>
  );
};

export default ExerciseSelectionItem;