import { Stack } from "expo-router";
import React from "react";

const ExerciseLayout = () => {
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
				name='exercise-list'
				options={{
					title: "Les mouvements",
				}}
			/>
		</Stack>
	);
};

export default ExerciseLayout;
