import { Stack } from "expo-router";

export default function NotificationLayout() {
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
				name='index'
				options={{
					title: "Notifications",
				}}
			/>
		</Stack>
	);
}
