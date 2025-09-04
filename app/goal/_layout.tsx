import { Stack } from "expo-router";

export default function GoalLayout() {
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
				name='add-goal'
				options={{
					title: "Ajouter un objectif",
				}}
			/>
			<Stack.Screen
				name='stats'
				options={{
					title: "Statistiques",
				}}
			/>
		</Stack>
	);
}
