import { HeaderBackButton } from "@react-navigation/elements";
import { Stack, router } from "expo-router";

export default function TrainingIdLayout () {

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
	);
}
