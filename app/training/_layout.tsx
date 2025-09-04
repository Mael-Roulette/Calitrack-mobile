import { Stack } from "expo-router";

export default function TrainingLayout() {
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
				name='add-training'
				options={{
					title: "Ajouter un entrainement",
				}}
			/>
			<Stack.Screen
				name='[id]'
				options={{
					headerShown: false,
				}}
			/>
		</Stack>
	);
}
