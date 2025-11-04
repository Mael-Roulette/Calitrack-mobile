import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const AboutLayout = () => {
	return (
		<SafeAreaView className='bg-background flex-1'>
			<Stack
				screenOptions={ {
					headerShown: true,
					headerStyle: {
						backgroundColor: "#FFF9F7",
					},
					headerTintColor: "#132541",
					headerTitleStyle: {
						fontFamily: "CalSans-Regular",
					},
					headerShadowVisible: false,
				} }
			>
				<Stack.Screen
					name='index'
					options={ {
						title: "À propos",
					} }
				/>
				<Stack.Screen
					name='legal-notices'
					options={ {
						title: "Mentions légales",
					} }
				/>
				<Stack.Screen
					name='privacy-policy'
					options={ {
						title: "Politique de confidentialité",
					} }
				/>
				<Stack.Screen
					name='support'
					options={ {
						title: "Support",
					} }
				/>
				<Stack.Screen
					name='terms-conditions'
					options={ {
						title: "Conditions générales d'utilisation",
					} }
				/>
			</Stack>
		</SafeAreaView>
	);
};

export default AboutLayout;
