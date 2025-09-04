import { getExericseById } from "@/lib/exercise.appwrite";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	Image,
	SafeAreaView,
	ScrollView,
	Text,
	View,
} from "react-native";

const ExerciseDetails = () => {
	const { id } = useLocalSearchParams();
	const [exercise, setExercise] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const navigation = useNavigation();

	useEffect(() => {
		const fetchExercise = async () => {
			setLoading(true);
			try {
				const response = await getExericseById(id as string);
				setExercise(response);
			} catch (error) {
				console.error("Erreur lors de la récupération de l'exercice", error);
				router.push("/exercise/exercise-list");
			} finally {
				setLoading(false);
			}
		};
		fetchExercise();
	}, [id, router]);

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: () => (
				<Text
					className='title-2 text-ellipsis overflow-hidden max-w-60'
					numberOfLines={1}
				>
					{exercise?.name || "Exercice"}
				</Text>
			),
		});
	}, [exercise]);
	return (
		<SafeAreaView className='flex-1 bg-background'>
			{loading ? (
				<View className='flex-1 items-center justify-center'>
					<ActivityIndicator size='large' color='#0000ff' />
					<Text>Chargement...</Text>
				</View>
			) : (
				<ScrollView>
					{exercise.image && (
						<View className='bg-secondary p-4 rounded-b-md'>
							<Image source={{ uri: exercise.image }} />
						</View>
					)}
					<View className='px-5 py-2'>
						<View className='flex-row items-center justify-between'>
							<Text className='text'>
								Type :{" "}
								<Text className='text-secondary'>{exercise.type.name}</Text>
							</Text>
							<Text className='text'>
								Difficulté :{" "}
								<Text className='text-secondary'>{exercise.difficulty}</Text>
							</Text>
						</View>
						<Text className='text mt-2'>{exercise.description}</Text>
					</View>
				</ScrollView>
			)}
		</SafeAreaView>
	);
};

export default ExerciseDetails;
