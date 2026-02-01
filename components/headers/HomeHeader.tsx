import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderContainer } from "./HeaderContainer";

interface HomeHeaderProps {
  greeting: string;
  weekInfo: string;
  onCalendarPress?: () => void;
}

export default function HomeHeader ( {
  greeting,
  weekInfo,
  onCalendarPress
}: HomeHeaderProps ) {
  const insets = useSafeAreaInsets();
  const currentDay = new Date().getDate();

  console.log( currentDay );

  function getMonday ( d: Date ) {
    d = new Date( d );
    let day = d.getDay(),
      diff = d.getDate() - day + ( day === 0 ? -6 : 1 );
    return new Date( d.setDate( diff ) );
  }

  // Générer les jours de la semaine actuelle
  function getWeekDays () {
    const monday = getMonday( new Date() );
    const dayLabels = [ "L", "M", "M", "J", "V", "S", "D" ];

    return dayLabels.map( ( label, index ) => {
      const date = new Date( monday );
      date.setDate( monday.getDate() + index );
      return {
        label,
        date: date.getDate()
      };
    } );
  }

  const days = getWeekDays();

  return (
    <HeaderContainer paddingTop={ insets.top }>
      <View className="flex-row justify-between items-start mb-6">
        {/* Greeting */}
        <View>
          <Text className="title text-background mb-2">{greeting}</Text>
          <Text className="text text-background font-bold text-xl">{weekInfo}</Text>
        </View>
        {/* Bouton calendrier */}
        <TouchableOpacity
          className="bg-white rounded-full p-2"
          onPress={ onCalendarPress }
        >
          <Ionicons name="calendar-outline" size={ 24 } color="#FC7942" />
        </TouchableOpacity>
      </View>
      {/* Week days */}
      <View className="flex-row justify-between">
        {days.map( ( day, index ) => (
          <View key={ index } className="items-center">
            <Text className="text-white text-xs mb-2">{day.label}</Text>
            <View
              className={ `w-12 h-12 rounded-full items-center justify-center ${
                day.date === currentDay ? "bg-primary" : "bg-background/60"
              }` }
            >
              <Text className={ `${ day.date === currentDay ? "text-background" : "text-primary"} font-bold text-lg` }>{day.date}</Text>
            </View>
          </View>
        ) )}
      </View>
    </HeaderContainer>
  );
}