import { Stack } from "expo-router";

export default function TrainingLayout () {
  return (
    <Stack screenOptions={ { headerShown: false } }>
      <Stack.Screen name="add-training-step-1" />
      <Stack.Screen name="add-training-step-2" />
    </Stack>
  );
}
