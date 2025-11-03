import { icons } from "@/constants/icons";
import useAuthStore from "@/store/auth.store";
import { TabBarIconProps } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";
import { Image, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TabIcon = ( { icon }: TabBarIconProps ) => (
	<Image source={ icon } style={ { width: 24, height: 24 } } />
);

const TabsLayout = () => {
	const { user } = useAuthStore();

	return (
		<SafeAreaView  className='bg-background flex-1'>
			<StatusBar barStyle='dark-content' />
			<Tabs
				screenOptions={ {
					headerShadowVisible: false,
					headerStyle: {
						backgroundColor: "#FFF9F7",
						height: 60,
					},
					headerTitleStyle: {
						fontFamily: "CalSans-Regular",
						fontSize: 26,
						color: "#132541",
						lineHeight: 24,
					},
					headerTitleAlign: "left",
					tabBarShowLabel: false,
					tabBarLabelPosition: "beside-icon",
					tabBarButton: ( props ) => (
						<TouchableOpacity
							{ ...( props as any ) }
							activeOpacity={ 1 }
							style={ [
								props.style,
								{
									flex: 1,
									borderRadius: 50,
									paddingHorizontal: 20,
								},
							] }
						/>
					),
					tabBarStyle: {
						backgroundColor: "#FFF9F7",
						paddingHorizontal: 8,
						paddingTop: 8,
						paddingBottom: 8,
						height: 65,
					},
					tabBarActiveBackgroundColor: "#FC7942",
					tabBarActiveTintColor: "#FFF9F7",
					tabBarInactiveTintColor: "#132541",
				} }
			>
				<Tabs.Screen
					name='index'
					options={ {
						title: "Accueil",
						headerTitle: `Salut ${user?.name || "utilisateur"} !`,
						tabBarIcon: ( { focused } ) => (
							<TabIcon icon={ focused ? icons.home_focus : icons.home } />
						),
					} }
				/>
				<Tabs.Screen
					name='goals'
					options={ {
						title: "Objectifs",
						headerTitle: "Mes objectifs",
						tabBarIcon: ( { focused } ) => (
							<TabIcon icon={ focused ? icons.goals_focus : icons.goals } />
						),
					} }
				/>
				<Tabs.Screen
					name='trainings'
					options={ {
						title: "Entraînements",
						headerTitle: "Mes entraînements",
						tabBarIcon: ( { focused } ) => (
							<TabIcon icon={ focused ? icons.training_focus : icons.training } />
						),
					} }
				/>
				<Tabs.Screen
					name='calendar'
					options={ {
						title: "Calendrier",
						headerTitle: "Calendrier",
						tabBarIcon: ( { focused } ) => (
							<TabIcon icon={ focused ? icons.calendar_focus : icons.calendar } />
						),
					} }
				/>
				<Tabs.Screen
					name='profile'
					options={ {
						title: "Profil",
						headerTitle: "Profil",
						headerRight: () => (
							<Link href="/settings" asChild>
								<TouchableOpacity
									style={ { marginRight: 20 } }
									accessibilityLabel="Paramètres"
								>
									<Ionicons name='settings-outline' size={ 30 } color='#132541' />
								</TouchableOpacity>
							</Link>
						),
						tabBarIcon: ( { focused } ) => (
							<TabIcon icon={ focused ? icons.profile_focus : icons.profile } />
						),
					} }
				/>
			</Tabs>
		</SafeAreaView>
	);
};

export default TabsLayout;