import { Stack } from "expo-router";

export default function SettingsLayout() {
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
				},
				headerShadowVisible: false,
			}}
		>
			<Stack.Screen
				name='index'
				options={{
					title: "Paramètres",
				}}
			/>
			<Stack.Screen
				name='account/index'
				options={{
					title: "Compte",
				}}
			/>
			<Stack.Screen
				name='notifications/index'
				options={{
					title: "Notifications",
				}}
			/>
			<Stack.Screen
				name='subscription/index'
				options={{
					title: "Abonnement",
				}}
			/>
			<Stack.Screen
				name='about'
				options={{
					title: "À propos",
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
