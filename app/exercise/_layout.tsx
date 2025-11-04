import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const ExerciseLayout = () => {
	return (

		<SafeAreaView className='bg-background flex-1'>
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
						title: "Les exercices",
					}}
				/>
			</Stack>
		</SafeAreaView>
	);
};

export default ExerciseLayout;
