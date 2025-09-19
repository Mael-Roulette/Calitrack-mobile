import ProgressOverview from "@/components/ProgressOverview";
import { icons } from "@/constants/icons";
import { useAuthStore, useGoalsStore } from "@/store";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoalStats from "../goal/components/GoalStats";
import CustomButton from "@/components/CustomButton";

const Profile = () => {
	const { user, isLoading } = useAuthStore();
	const { goals } = useGoalsStore();

	const handleViewAllStats = () => {
		router.push("/goal/stats");
	};

	return (
		<SafeAreaView className='bg-background flex-1'>
			{isLoading ? (
				<View>
					<Text className='text-xl font-calsans text-primary'>
						Chargement...
					</Text>
				</View>
			) : (
				<ScrollView className='px-5'>

					<View className=' flex-col items-center justify-center w-full mb-8'>
						<View className='w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden'>
							{user?.avatar ? (
								<Image
									source={{ uri: user.avatar }}
									className='w-full h-full'
									resizeMode='cover'
								/>
							) : (
								<View className='w-full h-full items-center justify-center'>
									<Ionicons name='person' size={50} color='#132541' />
								</View>
							)}
						</View>
						<View>
							<Link
								href={"/settings/account"}
								className='flex-row items-center h-8'
							>
								<Text className='text-2xl font-calsans text-primary'>
									{user?.name || "Utilisateur"}
								</Text>
								<View style={{ width: 10 }} />
								<Feather name='edit-3' size={20} color='#132541' />
							</Link>
						</View>
					</View>

					<ProgressOverview />

					<View className='mt-8'>
						<View className='flex-row items-center gap-4 mb-3'>
							<Image source={icons.stats} style={{ width: 30, height: 30 }} />
							<Text className='text-2xl text-primary font-calsans'>
								Mes stats
							</Text>
						</View>

						{goals
							.filter((goal) => goal.state === "in-progress")
							.map((goal) => (
								<GoalStats
									key={goal.$id}
									title={goal.title}
									state={goal.state ?? ""}
									progressHistory={goal.progressHistory}
									total={goal.total}
								/>
							))}
					</View>
					{goals.length === 0 ? (
						<View className='mt-4'>
							<Text className='indicator-text'>
								Aucune stats sur les objectifs disponible.
							</Text>
						</View>
					) : (
						<CustomButton
							title='Toutes mes stats'
							onPress={handleViewAllStats}
							variant='secondary'
						/>
					)}
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

export default Profile;
