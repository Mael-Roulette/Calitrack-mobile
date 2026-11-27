import Feather from "@expo/vector-icons/Feather";
import { Text, TouchableOpacity, View } from "react-native";

interface ExerciseTypeItemProps {
  handlePress: () => void;
  title: string;
  description: string;
}

export default function ExerciseTypeItem ( { handlePress, title, description }: ExerciseTypeItemProps ) {
  return (
    <TouchableOpacity
      className="border border-secondary rounded-xl p-5 mb-4 flex-row items-center justify-between"
      onPress={ handlePress }
      activeOpacity={ 0.7 }
      accessibilityRole="button"
      accessibilityLabel={ title }
    >
      <View>
        <Text className="title-2">{ title }</Text>
        <Text className="indicator-text">{ description }</Text>
      </View>
      <Feather name="chevron-right" size={ 24 } className="text-primary" />
    </TouchableOpacity>
  );
}