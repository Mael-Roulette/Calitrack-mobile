import { HeaderBackButton } from "@react-navigation/elements";
import { Stack, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TrainingIdLayout () {

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
					name='edit'
					options={ {
						title: "Modifier l'entraînement",
					} }
				/>
				<Stack.Screen
					name='index'
					options={ {
						headerTitle: "Entraînement",
						headerBackVisible: false,
						headerLeft: () => (
							<HeaderBackButton
								tintColor='#132541'
								onPress={ () => router.back() }
							/>
						),
					} }
				/>
				<Stack.Screen
					name='session'
					options={ {
						title: "Session d'entraînement",
						headerBackVisible: false,
						headerLeft: () => (
							<HeaderBackButton
								tintColor='#132541'
								onPress={ () => router.back() }
							/>
						),
					} }
				/>
			</Stack>
		</SafeAreaView>
	);
}
