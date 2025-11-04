import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarLayout () {
	return (
		<SafeAreaView className='bg-background flex-1' edges={ [ 'bottom' ] }>
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
					name='day'
					options={ {
						title: "Jour",
					} }
				/>
			</Stack>
		</SafeAreaView>
	);
}
