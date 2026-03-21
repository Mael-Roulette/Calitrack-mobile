import { DAY_LABELS } from "@/constants/value";
import { Training } from "@/types";
import { formatDuration } from "@/utils/string";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import CustomButton from "../ui/CustomButton";

interface TrainingCardProps {
  training: Training;
  onDelete?: ( id: string ) => void;
}

export default function TrainingCard ( { training, onDelete }: TrainingCardProps ) {
  const goToTraining = () => {
    router.push( `/training/${training.$id}/page` );
  };

  return (
    <View className='w-full px-5 py-4 mb-5 gap-3 border-[1px] rounded-xl border-secondary'>
      <View className='flex-row justify-between items-center gap-12'>
        <Text
          className={ `font-sregular text-xl flex-1 "text-primary"
          }` }
        >
          { training.name }
        </Text>
        <View className='flex-row items-center gap-2'>
          <Ionicons
            name='time-sharp'
            size={ 24 }
            color={ "#132541" }
          />
          <Text
            className={ "font-sregular text-base text-primary" }
          >
            { formatDuration( training.duration ) }
          </Text>
        </View>
      </View>
      { training.days!.length > 0 && (
        <ScrollView
          horizontal={ true }
          showsHorizontalScrollIndicator={ false }
          contentContainerStyle={ { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 1 } }
        >
          { training.days!.map( ( day, index ) => (
            <Text
              key={ index }
              className="py-1 px-3 bg-background rounded-full border border-secondary text-secondary font-sregular text-xs"
            >
              { DAY_LABELS[ day ] ?? day }
            </Text>
          ) ) }
        </ScrollView>
      ) }
      <CustomButton title="Voir l'entraînement" variant="secondary"onPress={ goToTraining } />
    </View>
  );
}