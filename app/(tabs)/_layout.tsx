import CustomHeader from "@/components/CustomHeader";
import { icons } from "@/constants/icons";
import useAuthStore from "@/store/auth.store";
import { TabBarIconProps } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";
import { Image, TouchableOpacity } from "react-native";

const TabIcon = ( { icon }: TabBarIconProps ) => (
	<Image source={ icon } style={ { width: 24, height: 24 } } />
);

const TabsLayout = () => {
	const { isAuthenticated, user } = useAuthStore();

	if ( !isAuthenticated ) return <Redirect href={ "/sign-in" } />;
	return (
		<Tabs
			screenOptions={ {
				headerShadowVisible: false,
				headerStyle: {
					backgroundColor: "#FFF9F7",
				},
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
					tabBarIcon: ( { focused } ) => (
						<TabIcon icon={ focused ? icons.home_focus : icons.home } />
					),
					headerTitle: () => (
						<CustomHeader
							title={ `Salut ${user?.name || "utilisateur"} !` }
						/>
					),
				} }
			/>
			<Tabs.Screen
				name='goals'
				options={ {
					title: "Objectifs",
					tabBarIcon: ( { focused } ) => (
						<TabIcon icon={ focused ? icons.goals_focus : icons.goals } />
					),
					headerTitle: () => (
						<CustomHeader
							title={ "Mes objectifs" }
						/>
					),
				} }
			/>
			<Tabs.Screen
				name='trainings'
				options={ {
					title: "Entraînements",
					tabBarIcon: ( { focused } ) => (
						<TabIcon icon={ focused ? icons.training_focus : icons.training } />
					),
					headerTitle: () => (
						<CustomHeader
							title={ "Mes entraînements" }
						/>
					),
				} }
			/>
			<Tabs.Screen
				name='calendar'
				options={ {
					title: "Calendrier",
					tabBarIcon: ( { focused } ) => (
						<TabIcon icon={ focused ? icons.calendar_focus : icons.calendar } />
					),
					headerTitle: () => <CustomHeader title={ "Calendrier" } />,
				} }
			/>
			<Tabs.Screen
				name='profile'
				options={ {
					title: "Profil",
					tabBarIcon: ( { focused } ) => (
						<TabIcon icon={ focused ? icons.profile_focus : icons.profile } />
					),
					headerTitle: () => (
						<CustomHeader
							title={ "Profil" }
							link={ "/settings" }
							icon={
								<Ionicons name='settings-outline' size={ 30 } color='#132541' />
							}
						/>
					),
				} }
			/>
		</Tabs>
	);
};

export default TabsLayout;
