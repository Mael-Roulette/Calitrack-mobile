import HomeHeader from "@/components/headers/HomeHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage () {
  return (
    <SafeAreaView>
      <HomeHeader
        greeting="Salut Mael !"
        weekInfo="Semaine 1 - Planche"
        onCalendarPress={ () => {} }
      />
    </SafeAreaView>
  );
}