import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const Index = () => {
	return (
		<SafeAreaView className='flex-1 px-5 bg-background'>
			<View className='mb-8'>
				<Text className='text-primary font-calsans text-xl'>Entrainements</Text>
				{/* TODO: Ajouter les notifications */}
			</View>
		</SafeAreaView>
	);
};

export default Index;
