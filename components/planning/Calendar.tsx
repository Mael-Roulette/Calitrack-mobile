import { DAY_INDEX_MAP } from "@/constants/date";
import useTrainingsStore from "@/store/training.store";
import { useState } from "react";
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

const CalendarSection = () => {
  const [ selected, setSelected ] = useState( "" );
  const { trainings } = useTrainingsStore();

  const selectedTraining = selected
    ? ( () => {
      const dayIndex = new Date( selected ).getDay();
      const dayKey = DAY_INDEX_MAP[ dayIndex ];
      return trainings.find( ( t ) => t.days?.includes( dayKey ) ) ?? null;
    } )()
    : null;

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