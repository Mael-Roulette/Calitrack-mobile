import { useAuthStore } from "@/store";
import { useFonts } from "expo-font";
import * as NavigationBar from "expo-navigation-bar";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, View } from "react-native";
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
  const { isAuthenticated, fetchAuthenticatedUser, isLoading } = useAuthStore();

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

    // Configuration de la barre de navigation pour Android
    if ( Platform.OS === "android" ) {
      ( async () => {
        await NavigationBar.setButtonStyleAsync( "dark" );
      } )();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );


  if ( !fontsLoaded || isLoading ) {
    return null;
  }

  return (
    <View style={ { flex: 1, backgroundColor: "#FFF9F7" } }>
      <Stack screenOptions={ { headerShown: false } }>
        <Stack.Protected guard={ !isAuthenticated }>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={ isAuthenticated }>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
      </Stack>
    </View>
  );
};