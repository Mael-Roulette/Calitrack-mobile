import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import PrimaryGradient from "../PrimaryGradient";

interface TrainingDayProps {
  title: string
  duration: number
}

export default function TrainingDay ( { title, duration }: TrainingDayProps ) {
  return (
    <PrimaryGradient>
      <View className='px-4 py-4 gap-5'>
        <View className="flex-row items-center justify-between gap-5">
          <Text className="text text-background flex-shrink truncate line-clamp-1">{ title }</Text>

          <View className="flex-row gap-2 items-center">
            <Ionicons name="time" size={ 24 } color={ "#FFF9F7" } />
            <Text className="text text-background">40 minutes</Text>
          </View>
        </View>

        <Pressable className="btn-primary border-0">
          <Text className="text-secondary font-bold text-lg">Voir ma séance</Text>
        </Pressable>
      </View>
    </PrimaryGradient>
  );
}