import { Stack } from "expo-router";
import React from "react";

const ExerciseIdLayout = () => {
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
          headerShown: false,
        } }
      />
      <Stack.Screen
        name="edit"
        options={ {
          title: "Modifier un exercice"
        } }
      />
    </Stack>
  );
};

export default ExerciseIdLayout;