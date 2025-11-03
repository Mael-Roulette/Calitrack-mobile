import { useAuthStore } from "@/store";
import { useFonts } from "expo-font";
import * as Notifications from 'expo-notifications';
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";

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
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [] );

	if ( !fontsLoaded || isLoading ) {
		return null;
	}

	return (
		<SafeAreaView className='bg-background flex-1'>
			<StatusBar barStyle='dark-content' />
			<Stack screenOptions={ { headerShown: false } } />
		</SafeAreaView>
	);
};