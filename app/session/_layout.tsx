import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function TrainingLayout () {
  return (
    <GestureHandlerRootView style={ { flex: 1 } }>
      <Stack screenOptions={ { headerShown: false } }>
        <Stack.Screen name="[id]/page" />
      </Stack>
    </GestureHandlerRootView>
  );
}