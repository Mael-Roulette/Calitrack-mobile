import { useAuthStore } from "@/store";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import {
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";

const Index = () => {
	const { logout, fetchAuthenticatedUser } = useAuthStore();

	const handleLogout = async () => {
		await logout();
		await fetchAuthenticatedUser();

		router.replace("/(auth)");
	};

	return (
		<SafeAreaView className='bg-background flex-1'>
			<ScrollView>
				<View className='flex-col gap-6 mb-4 pt-5 first:border-t-[1px] first:border-gray-200'>
					{[
						{ title: "Compte", screen: "account" },
						{ title: "Notifications", screen: "notifications" },
						{ title: "Abonnement", screen: "subscription" },
						{ title: "À propos", screen: "about" },
					].map((item, index) => (
						<View
							key={index}
							className='flex-row items-center justify-between pb-4 border-b-[1px] border-gray-200'
						>
							<Link
								href={`./settings/${item.screen}`}
								style={{ paddingHorizontal: 20 }}
							>
								<View className='flex-row items-center justify-between w-full'>
									<Text className='text-lg font-calsans text-primary'>
										{item.title}
									</Text>
									<Entypo
										name='chevron-small-right'
										size={24}
										color='#132541'
									/>
								</View>
							</Link>
						</View>
					))}
				</View>
				<View className='px-5'>
					<TouchableOpacity
						onPress={handleLogout}
						className='flex-row items-center py-3'
					>
						<Ionicons name='log-out-outline' size={24} color='#F43F5E' />
						<Text className='ml-3 text-lg text-rose-500 font-medium'>
							Déconnexion
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Index;
