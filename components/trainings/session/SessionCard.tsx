import CustomButton from "@/components/ui/CustomButton";
import { Session } from "@/types/session";
import { formatDate } from "@/utils/date";
import { router } from "expo-router";
import { Text, View } from "react-native";

interface SessionCardProps {
  session: Session
}

const SessionCard = ( { session }: SessionCardProps ) => {
  const handleSeePreviousSession = () => {
    router.push( `/session/${session.$id}/page` );
  };

  return (
    <View className='w-full px-5 py-4 mb-5 gap-3 border-[1px] rounded-xl border-secondary'>
      <View className='flex-row justify-between items-center gap-5 max-w-full'>
        <Text className="text-lg-custom flex-shrink" numberOfLines={ 1 } ellipsizeMode="tail">{ session.weekName } : { session.trainingName }</Text>
        <Text className="text-lg-custom">{ formatDate( session.$createdAt )}</Text>
      </View>
      <CustomButton title="Voir la session" variant="secondary"onPress={ handleSeePreviousSession } />
    </View>
  );
};

export default SessionCard;