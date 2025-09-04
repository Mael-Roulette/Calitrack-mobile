import { Stack } from "expo-router";

export default function CalendarLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: true,
				headerStyle: {
					backgroundColor: "#FFF9F7",
				},
				headerTintColor: "#132541",
				headerTitleStyle: {
					fontFamily: "CalSans-Regular",
					fontSize: 24,
				},
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen
				name='day'
				options={{
					title: "Jour",
				}}
			/>
		</Stack>
	);
}
