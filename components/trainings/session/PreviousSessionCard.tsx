import CustomButton from "@/components/ui/CustomButton";
import useWeeksStore from "@/store/week.store";
import { Session } from "@/types/session";
import { formatDate } from "@/utils/date";
import { router } from "expo-router";
import { Text, View } from "react-native";

interface PreviousSessionCardProps {
  session: Session
}

const PreviousSessionCard = ( { session }: PreviousSessionCardProps ) => {
  const { getWeekById } = useWeeksStore();
  const week = getWeekById( session.training.week );

  const handleSeePreviousSession = () => {
    router.push( `./session/${session.$id}` );
  };

  return (
    <View className='w-full px-5 py-4 mb-5 gap-3 border-[1px] rounded-xl border-secondary'>
      <View className='flex-row justify-between items-center gap-12'>
        <Text className="text-lg-custom">{ week?.name } : { session.training.name }</Text>
        <Text className="text-lg-custom">{ formatDate( session.$createdAt )}</Text>
      </View>
      <CustomButton title="Voir la session" variant="secondary"onPress={ handleSeePreviousSession } />
    </View>
  );
};

export default PreviousSessionCard;