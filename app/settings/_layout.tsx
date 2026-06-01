import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsLayout () {
  return (
    <SafeAreaView className='bg-background flex-1' edges={ [ "bottom" ] }>
      <Stack
        screenOptions={ {
          headerShown: false,
        } }
      >
        <Stack.Screen
          name='index'
        />
        <Stack.Screen
          name='about'
        />
      </Stack>
    </SafeAreaView>
  );
}