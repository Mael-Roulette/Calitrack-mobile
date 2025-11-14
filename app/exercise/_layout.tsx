import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

const ExerciseLayout = () => {
	return (
		<Stack
			screenOptions={ {
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
			} }
		>
			<Stack.Screen
				name="index"
				options={ {
					title: "Exercices",
					headerRight: () => (
						<TouchableOpacity onPress={ () => router.push('/exercise/add-exercise') } className="mr-4" accessibilityLabel="Ajouter un exercise">
							<Ionicons name='add-circle-outline' size={ 30 } color='#132541' />
						</TouchableOpacity>
					)
				} }
			/>
			<Stack.Screen
				name="add-exercise"
				options={{
					title: "Ajouter un exercice"
				}}
			/>
			<Stack.Screen
				name="[id]"
				options={ {
					headerShown: false,
				} }
			/>
		</Stack>
	);
};

export default ExerciseLayout;