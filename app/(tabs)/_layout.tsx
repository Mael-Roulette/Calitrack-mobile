import Octicons from '@expo/vector-icons/Octicons';
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function TabsLayout () {
  return (
    <>
      <StatusBar style="light"/>
      <Tabs
        screenOptions={ {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#FFF9F7',
            paddingTop: 5
          },
          tabBarInactiveTintColor: "#132541",
          tabBarActiveTintColor: "#FC7942",
        } }
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({color, size}) => (
              <Octicons name="home-fill" size={size} color={color} />
            )
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            tabBarIcon: ({color, size}) => (
              <Octicons name="goal" size={size} color={color} />
            )
          }}
        />
      </Tabs>


    </>
  );
}