import React from "react";
import { ScrollView, Text, View, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Support = () => {
	return (
		<SafeAreaView className='flex-1 px-5 bg-background'>
			<ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
				<View>
					<Text className='title-2 mb-4'>💬&nbsp;Besoin d&apos;aide ?</Text>
					<Text className='indicator-text mb-4'>
						Une question, un problème ou un retour à nous partager ? Nous sommes
						là pour vous aider et répondrons dans les plus brefs délais.
					</Text>
					<Text className='mb-2 text'>
						Vous pouvez nous contacter à l&apos;adresse suivante&nbsp;:&nbsp;
						<Text
							className='text-primary font-sregular underline'
							onPress={() => {
								Linking.openURL("mailto:calitrack@mael-roulette.fr");
							}}
						>
							calitrack@mael-roulette.fr
						</Text>
					</Text>
				</View>

				<View className='mt-6'>
					<Text className='title-2 mb-4'>🌐&nbsp;Site officiel</Text>
					<Text className='indicator-text mb-4'>
						Retrouvez des informations sur l&apos;avancement de
						l&apos;application, les mises à jour et la résolution des bugs sur
						notre site officiel ou sur notre Github.
					</Text>
					<Text
						className='text-primary font-sregular underline mb-2'
						onPress={() => {
							Linking.openURL("https://calitrack.mael-roulette.fr");
						}}
					>
						Site officiel
					</Text>
					<Text
						className='text-primary font-sregular underline'
						onPress={() => {
							Linking.openURL("https://github.com/Mael-Roulette/Calitrack");
						}}
					>
						Github
					</Text>
				</View>

				<View className='mt-6'>
          <Text className='title-2 mb-4'>📱&nbsp;Réseaux sociaux</Text>
					<Text className='mb-2 text'>
						Suivez-nous sur Instagram pour ne rien manquer de nos actualités,
            conseils et nouveautés&nbsp;:&nbsp;
						<Text
							className='text-primary font-sregular underline'
							onPress={() => {
								Linking.openURL("https://instagram.com/calitrack_app");
							}}
						>
							@calitrack_app
						</Text>
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Support;
