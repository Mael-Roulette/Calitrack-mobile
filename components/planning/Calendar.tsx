import { DAY_INDEX_MAP } from "@/constants/date";
import useTrainingsStore from "@/store/training.store";
import useWeeksStore from "@/store/week.store";
import { getTodayDate, getWeekIndexInMonth } from "@/utils/date";
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


const CalendarSection = () => {
  const [ selected, setSelected ] = useState( "" );
  const { trainings } = useTrainingsStore();
  const { weeks } = useWeeksStore();

  /**
   * Permet de récupérer l'entrainement et la semaine lié au jour cliqué
   */
  const selectedData = useMemo( () => {
    if ( !selected || !weeks.length || !trainings.length ) return null;

    const sorted = [ ...weeks ].sort( ( a, b ) => a.order - b.order );

    const weekIndexInMonth = getWeekIndexInMonth( selected );
    const rotatedIndex = weekIndexInMonth % sorted.length;
    const currentWeek = sorted[ rotatedIndex ];

    const [ y, m, d ] = selected.split( "-" ).map( Number );
    const dayKey = DAY_INDEX_MAP[ new Date( y, m - 1, d ).getDay() ];

    const training =
      trainings
        .filter( t => t.week === currentWeek.$id )
        .find( t => t.days?.includes( dayKey ) ) ?? null;

    return {
      week: currentWeek,
      training
    };
  }, [ selected, weeks, trainings ] );

  /**
   * Permet de récupérer les jours ayant un entrainement
   */
  const markedDates = useMemo( () => {
    const marks: Record<string, any> = {};

    if ( !weeks.length || !trainings.length ) return marks;

    const sortedWeeks = [ ...weeks ].sort( ( a, b ) => a.order - b.order );

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    // nombre de jours dans le mois courant
    const daysInMonth = new Date( year, month + 1, 0 ).getDate();

    for ( let day = 1; day <= daysInMonth; day++ ) {
      const date = new Date( year, month, day );

      const dateString = [
        year,
        String( month + 1 ).padStart( 2, "0" ),
        String( day ).padStart( 2, "0" )
      ].join( "-" );

      const weekIndexInMonth = getWeekIndexInMonth( dateString );
      const rotatedIndex = weekIndexInMonth % sortedWeeks.length;
      const currentWeek = sortedWeeks[ rotatedIndex ];

      const dayKey = DAY_INDEX_MAP[ date.getDay() ];

      const hasTraining = trainings.some(
        t =>
          t.week === currentWeek.$id &&
        t.days?.includes( dayKey )
      );

      // Vérifie si le jour à un entrainement et si la date et supérieur ou égale à la date du jour
      if ( hasTraining && date >= today ) {
        marks[ dateString ] = {
          dots: [
            {
              key: "training",
              color: "#FC7942"
            }
          ]
        };
      }
    }

    return marks;
  }, [ weeks, trainings ] );

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
        firstDay={ 1 }
        minDate={ getTodayDate() }
        enableSwipeMonths
        onDayPress={ day => {
          setSelected( day.dateString );
        } }
        markingType="multi-dot"
        markedDates={ {
          ...markedDates, // Affichage d'un point coloré lorsqu'il y a un entrainement sur cette date
          ...( selected
            ? {
              [ selected ]: {
                ...markedDates[ selected ],
                selected: true,
                selectedColor: "#FC7942"
              }
            }
            : {} )
        } }
      />

      <View className="mt-4">
        {selected ? (
          selectedData?.training ? (
            <View className="mt-5">
              <Text className="title mb-3">{selectedData.week.name}</Text>
              <TrainingCard training={ selectedData.training } />
            </View>
          ) : (
            <Text className="text-center text-lg-custom mt-5 text-secondary">
              Aucun entraînement prévu ce jour.
            </Text>
          )
        ) : (
          <Text className="text-center text-lg-custom mt-5">Sélectionne une date pour voir son contenu</Text>
        )}
      </View>
    </View>
  );
};

export default CalendarSection;