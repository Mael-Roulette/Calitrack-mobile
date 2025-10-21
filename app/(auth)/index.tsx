import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import CustomButton from "../../components/CustomButton";

const Index = () => {
	const signin = () => {
		router.push("/sign-in");
	};

	const signup = () => {
		router.push("/sign-up");
	};

	return (
		<View className='px-5 py-10 bg-background flex-1'>
			<View className='mb-14'>
				<Text className='text-3xl text-primary font-calsans text-center mb-3'>
					Bienvenue sur <Text className='text-secondary'>Calitrack</Text>
				</Text>
				<Text className='text-lg text-primary font-sregular text-center'>
					Un seul endroit pour suivre vos séances, progresser et rester motivé
				</Text>
			</View>

			<View className='gap-4 mb-14'>
				<CustomButton title='Connexion' onPress={signin} />

				<CustomButton
					title='Inscription'
					onPress={signup}
					variant='secondary'
				/>
			</View>
		</View>
	);
};

export default Index;
