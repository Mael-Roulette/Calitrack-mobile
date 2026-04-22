import { Training } from "@/types";
import { formatMinutesDuration } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, View } from "react-native";
import CustomButton from "../ui/CustomButton";
import PrimaryGradient from "../ui/PrimaryGradient";

interface TrainingDayProps {
  training: Training
}

export default function TrainingDay ( { training }: TrainingDayProps ) {
  const handleLauchTraining = () => {
    router.push( "/training/[id]/session" );
  };

  return (
    <PrimaryGradient>
      <View className='px-4 py-4 gap-5'>
        <View className="flex-row items-center justify-between gap-5">
          <Text
            numberOfLines={ 1 }
            ellipsizeMode="tail"
            className="text text-background flex-shrink">
            { training.name }
          </Text>

          <View className="flex-row gap-2 items-center">
            <Ionicons name="time" size={ 24 } color={ "#FFF9F7" } />
            <Text className="text text-background">{ formatMinutesDuration( training.duration ) }</Text>
          </View>
        </View>

        <CustomButton
          title="Voir ma séance"
          onPress={ handleLauchTraining }
          customStyles="border-0"
        />
      </View>
    </PrimaryGradient>
  );
}