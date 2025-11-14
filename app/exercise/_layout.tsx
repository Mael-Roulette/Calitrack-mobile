import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from "react";
import CustomExerciseList from "./custom-exercise-list";
import ExerciseList from "./exercise-list";

const Tab = createMaterialTopTabNavigator();

const ExerciseLayout = () => {
	return (
		<Tab.Navigator>
			<Tab.Screen name="Généraux" component={ ExerciseList } />
			<Tab.Screen name="Profile" component={ CustomExerciseList } />
		</Tab.Navigator>
	);
};

export default ExerciseLayout;
