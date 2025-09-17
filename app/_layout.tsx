import { useAuthStore } from "@/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { View } from "react-native";
import "./globals.css";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler( {
	handleNotification: async () => ( {
		shouldPlaySound: true,
		shouldSetBadge: true,
		shouldShowBanner: true,
		shouldShowList: true,
	} ),
} );

export default function RootLayout () {
	const { fetchAuthenticatedUser, isLoading } = useAuthStore();

	const [ fontsLoaded, error ] = useFonts( {
		"CalSans-Regular": require( "../assets/fonts/CalSans-Regular.ttf" ),
		"Sora-Regular": require( "../assets/fonts/Sora-Regular.ttf" ),
	} );

	useEffect( () => {
		if ( error ) throw error;
		if ( fontsLoaded ) SplashScreen.hideAsync();
	}, [ fontsLoaded, error ] );

	useEffect( () => {
		fetchAuthenticatedUser();
	}, [] );

	if ( !fontsLoaded || isLoading ) {
		return null;
	}

	return (
		<View className='bg-background flex-1'>
			<Stack screenOptions={ { headerShown: false } } />
		</View>
	);
};