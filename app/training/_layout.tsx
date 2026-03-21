import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TrainingLayout () {
  return (
    <GestureHandlerRootView style={ { flex: 1 } }>
      <Stack screenOptions={ { headerShown: false } }>
        <Stack.Screen name="add-training-step-1" />
        <Stack.Screen name="add-training-step-2" />
      </Stack>
    </GestureHandlerRootView>
  );
}