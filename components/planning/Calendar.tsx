import { DAY_INDEX_MAP } from "@/constants/date";
import useTrainingsStore from "@/store/training.store";
import useWeeksStore from "@/store/week.store";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import TrainingCard from "../trainings/TrainingCard";

LocaleConfig.locales[ "fr" ] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ],
  monthNamesShort: [ "Janv.", "Févr.", "Mars", "Avril", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc." ],
  dayNames: [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ],
  dayNamesShort: [ "Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam." ],
  today: "Aujourd'hui"
};

LocaleConfig.defaultLocale = "fr";

function getWeekIndexInMonth ( dateString: string ): number {
  const [ y, m, d ] = dateString.split( "-" ).map( Number );
  const selected = new Date( y, m - 1, d );
  const firstOfMonth = new Date( y, m - 1, 1 );

  // Quel lundi précède ou est le 1er du mois
  const firstDay = firstOfMonth.getDay(); // 0=dim, 1=lun...
  const offset = firstDay === 0 ? -6 : 1 - firstDay;
  const firstMonday = new Date( firstOfMonth );
  firstMonday.setDate( 1 + offset );

  const diffMs = selected.getTime() - firstMonday.getTime();
  return Math.floor( diffMs / ( 7 * 24 * 60 * 60 * 1000 ) );
}

const CalendarSection = () => {
  const [ selected, setSelected ] = useState( "" );
  const { trainings } = useTrainingsStore();
  const { weeks } = useWeeksStore();

  const selectedTraining = useMemo( () => {
    if ( !selected || !weeks.length ) return null;

    const sorted = [ ...weeks ].sort( ( a, b ) => a.order - b.order );
    const weekIndexInMonth = getWeekIndexInMonth( selected );
    const rotatedIndex = weekIndexInMonth % sorted.length;
    const currentWeek = sorted[ rotatedIndex ];

    const [ y, m, d ] = selected.split( "-" ).map( Number );
    const dayKey = DAY_INDEX_MAP[ new Date( y, m - 1, d ).getDay() ];

    return (
      trainings
        .filter( ( t ) => t.week === currentWeek.$id )
        .find( ( t ) => t.days?.includes( dayKey ) ) ?? null
    );
  }, [ selected, trainings, weeks ] );

  return (
    <View className="p-5">
      <Calendar
        theme={ {
          backgroundColor: "#FFF9F7",
          calendarBackground: "#FFF9F7",
          textSectionTitleColor: "#132541",
          selectedDayBackgroundColor: "#00adf5",
          selectedDayTextColor: "#FFF9F7",
          todayTextColor: "#FC7942",
          dayTextColor: "#132541",
          textDisabledColor: "#617188",
          arrowColor: "#FC7942",
          arrowHeight: 40,
          arrowWidth: 40
        } }
        onDayPress={ day => {
          setSelected( day.dateString );
        } }
        markedDates={ {
          [ selected ]: { selected: true, disableTouchEvent: true, selectedColor: "#FC7942" }
        } }
      />

      <View className="mt-4">
        {selected && (
          selectedTraining
            ? <TrainingCard training={ selectedTraining } />
            : <Text className="text-center font-sregular text-secondary">
              Aucun entraînement prévu ce jour.
            </Text>
        )}
      </View>
    </View>
  );
};

export default CalendarSection;