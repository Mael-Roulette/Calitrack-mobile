import { CalendarDay } from "@/types";
import { router } from "expo-router";
import { Calendar, LocaleConfig } from "react-native-calendars";

const CustomCalendar = () => {
	const currentDate = new Date().toISOString();

	LocaleConfig.locales["fr"] = {
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
			"Décembre",
		],
		monthNamesShort: [
			"Janv.",
			"Févr.",
			"Mars",
			"Avril",
			"Mai",
			"Juin",
			"Juil.",
			"Août",
			"Sept.",
			"Oct.",
			"Nov.",
			"Déc.",
		],
		dayNames: [
			"Dimanche",
			"Lundi",
			"Mardi",
			"Mercredi",
			"Jeudi",
			"Vendredi",
			"Samedi",
		],
		dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
		today: "Aujourd'hui",
	};
	LocaleConfig.defaultLocale = "fr";

	const goToSelectedDay = (day: CalendarDay) => {
		router.push({
			pathname: "/calendar/day",
			params: {
				day: day.day,
				month: day.month,
				year: day.year,
			},
		});
	};

	return (
		<Calendar
			current={currentDate}
			markedDates={{
				currentDate: { marked: true, dotColor: "#132541" },
			}}
			onDayPress={(day: any) => {
				goToSelectedDay(day);
			}}
			theme={{
				backgroundColor: "#FFF9F7",
				calendarBackground: "#FFF9F7",
				arrowColor: "#132541",
				monthTextColor: "#132541",
				textDayFontFamily: "Sora-Regular",
				textMonthFontFamily: "CalSans-Regular",
				dayTextColor: "#132541",
				textDisabledColor: "#AEC4E7",
				textMonthFontSize: 24,
				todayBackgroundColor: "#FC7942",
				todayTextColor: "#FFF9F7",
			}}
		/>
	);
};

export default CustomCalendar;
