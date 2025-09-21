import { APP_VERSION } from "@/constants/value";
import { deleteAccount } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import { Link, router } from "expo-router";
import { useState } from "react";
import {
	Alert,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
	const [isLoading, setIsLoading] = useState(false);
	const { setIsAuthenticated, setUser } = useAuthStore();

	const handleDeleteAccount = async () => {
		Alert.alert(
			"Supprimer votre compte",
			"Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?",
			[
				{ text: "Annuler", style: "cancel" },
				{
					text: "Supprimer",
					style: "destructive",
					onPress: async () => {
						setIsLoading(true);
						try {
							await deleteAccount();

							setIsAuthenticated(false);
							setUser(null);

							router.replace("/(auth)");

							Alert.alert(
								"Compte supprimé",
								"Votre compte a été supprimé avec succès."
							);
						} catch (error) {
							const errorMessage =
								error instanceof Error ? error.message : String(error);
							Alert.alert(
								"Erreur",
								"Une erreur est survenue lors de la suppression de votre compte."
							);
							console.error("Delete account error:", errorMessage);
						} finally {
							setIsLoading(false);
						}
					},
				},
			]
		);
	};

	if ( isLoading ) {
		return (
			<SafeAreaView className='bg-background flex-1 justify-center items-center'>
				<Text className='text-primary text-lg'>Suppression en cours...</Text>
			</SafeAreaView>
		)
	}


	return (
		<SafeAreaView className='bg-background flex-1'>
			<ScrollView>
				<View className='px-5 py-4'>
					<Text className='text-lg font-calsans text-primary-100'>
						Version : {APP_VERSION}
					</Text>
				</View>
				<View className='flex-col gap-6 mb-4 pt-5 first:border-t-[1px] first:border-gray-200'>
					{[
						{ title: "Mentions légales", screen: "about/legal-notices" },
						{
							title: "Politique de confidentialité",
							screen: "about/privacy-policy",
						},
						{
							title: "Conditions générales d'utilisation",
							screen: "about/terms-conditions",
						},
						{ title: "Support", screen: "about/support" },
					].map((item, index) => (
						<View
							key={index}
							className='flex-row items-center justify-between pb-4 border-b-[1px] border-gray-200'
						>
							<Link href={`./${item.screen}`} style={{ paddingHorizontal: 20 }}>
								<View className='flex-row items-center justify-between w-full'>
									<Text className='text-lg font-calsans text-primary'  numberOfLines={ 1 }>
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
					<Text className='indicator-text mb-4 mt-8'>
						La suppression de votre compte est irréversible et entraînera la
						perte de toutes vos données.
					</Text>
					<TouchableOpacity
						onPress={handleDeleteAccount}
						className='flex-row items-center py-3'
					>
						<Ionicons name='log-out-outline' size={24} color='#F43F5E' />
						<Text className='ml-3 text-lg text-rose-500 font-medium'>
							Supprimer mon compte
						</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Index;
