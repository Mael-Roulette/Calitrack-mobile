import { useAuthStore } from "@/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import "./globals.css";

export default function RootLayout() {
	const { fetchAuthenticatedUser, isLoading } = useAuthStore();

	const [fontsLoaded, error] = useFonts({
		"CalSans-Regular": require("../assets/fonts/CalSans-Regular.ttf"),
		"Sora-Regular": require("../assets/fonts/Sora-Regular.ttf"),
	});

	useEffect(() => {
		if (error) throw error;
		if (fontsLoaded) SplashScreen.hideAsync();
	}, [fontsLoaded, error]);

	useEffect(() => {
		fetchAuthenticatedUser();
	}, []);

	if (!fontsLoaded || isLoading) {
		return null;
	}

	return (
		<View className='bg-background flex-1'>
			<Stack screenOptions={{ headerShown: false }} />
		</View>
	);
};