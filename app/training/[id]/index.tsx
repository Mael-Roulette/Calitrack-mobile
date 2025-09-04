import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import GoalItem from "@/app/goal/components/GoalItem";
import { DAYS_TRANSLATION } from "@/constants/value";
import { deleteTraining, getTrainingById } from "@/lib/training.appwrite";
import { useGoalsStore, useTrainingsStore } from "@/store";
import { Exercise, Goal } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	Text,
	TouchableOpacity,
	View,
	SafeAreaView
} from "react-native";

const Index = () => {
	const { id } = useLocalSearchParams();
	const [training, setTraining] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [trainingExercises, setTrainingExercises] = useState<Exercise[]>([]);
	const [showMenu, setShowMenu] = useState(false);
	const navigation = useNavigation();
	const { fetchUserTrainings } = useTrainingsStore();
	const { goals } = useGoalsStore();
	const [relatedGoals, setRelatedGoals] = useState<Goal[]>([]);

	useEffect(() => {
		const fetchTraining = async () => {
			setLoading(true);
			try {
				const response = await getTrainingById(id as string);
				setTraining(response);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération de l'entrainement",
					error
				);
				router.push("/trainings");
			} finally {
				setLoading(false);
			}
		};
		fetchTraining();
	}, [id, router]);

	const handleDelete = () => {
		setShowMenu(false);
		deleteTraining(training.$id)
			.then(() => fetchUserTrainings())
			.then(() => router.push("/trainings"));
	};

	const handleEdit = () => {
		setShowMenu(false);
		router.push(`/training/${id}/edit`);
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: () => (
				<Text
					className='title-2 text-ellipsis overflow-hidden max-w-60'
					numberOfLines={1}
				>
					{training?.name || "Entrainement"}
				</Text>
			),
			headerRight: () => (
				<View className='relative'>
					<TouchableOpacity
						onPress={() => setShowMenu(!showMenu)}
						accessibilityLabel='Voir les options'
					>
						<Feather name='more-vertical' size={30} color='#132541' />
					</TouchableOpacity>

					{showMenu && (
						<Modal
							transparent={true}
							visible={showMenu}
							animationType='fade'
							onRequestClose={() => setShowMenu(false)}
						>
							<TouchableOpacity
								style={{ flex: 1 }}
								activeOpacity={1}
								onPress={() => setShowMenu(false)}
							>
								<View className='absolute top-16 right-5 bg-background rounded-md shadow-lg elevation-md min-w-40'>
									<TouchableOpacity
										onPress={handleEdit}
										className='flex-row items-center px-4 py-3 border-b border-gray-200'
									>
										<Feather name='edit' size={18} color='#132541' />
										<Text className='ml-3 text-base font-sregular text-primary'>
											Modifier
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={handleDelete}
										className='flex-row items-center px-4 py-3'
									>
										<Feather name='trash-2' size={18} color='#ef4444' />
										<Text className='ml-3 text-base text-red-500 font-sregular'>
											Supprimer
										</Text>
									</TouchableOpacity>
								</View>
							</TouchableOpacity>
						</Modal>
					)}
				</View>
			),
		});
	}, [navigation, training, id, router, showMenu]);

	useEffect(() => {
		if (training && training.exercise) {
			setTrainingExercises(training.exercise);
		}
	}, [training]);

	const renderExerciseItem = ({ item }: { item: Exercise }) => (
		<ExerciseItem
			name={item.name}
			type={item.type}
			difficulty={item.difficulty}
			onPress={() => goToExerciseDetails(item.$id)}
		/>
	);

	const goToExerciseDetails = (id: string) => {
		router.push({
			pathname: "/exercise/[id]",
			params: { id },
		});
	};

	/* ----- Afficher les objectifs liés à l'entrainement ----- */
	useEffect(() => {
		if (!trainingExercises.length || !goals.length) return;

		const exerciseTypes = new Set(
			trainingExercises.map((exercise) =>
				exercise.type
			)
		);

		const matchingGoals = goals.filter(
			(goal) =>
				exerciseTypes.has(goal.type.name) && goal.state === "in-progress"
		);

		setRelatedGoals(matchingGoals);
	}, [trainingExercises, goals]);

	const renderGoalItem = ({ item }: { item: Goal }) => (
		<GoalItem
			key={item.$id}
			$id={item.$id}
			title={item.title}
			type={item.type}
			progress={item.progress}
			progressHistory={item.progressHistory}
			total={item.total}
			state={item.state}
			$createdAt={item.$createdAt}
			$updatedAt={item.$updatedAt}
		/>
	);

	return (
		<SafeAreaView className='bg-background min-h-full px-5'>
			{loading ? (
				<View className='flex-1 justify-center items-center'>
					<ActivityIndicator size='large' color='#FC7942' />
					<Text className='mt-2 text-primary'>Chargement...</Text>
				</View>
			) : (
				<>
					<View>
						<Text className='text-lg font-sregular text-primary mb-2'>
							Durée:{" "}
							{training?.duration < 60
								? `${training?.duration} minutes`
								: `${Math.floor((training?.duration ?? 0) / 60)}h${(training?.duration ?? 0) % 60 === 0 ? "" : (training?.duration ?? 0) % 60}`}
						</Text>
						{training.days.length > 0 && (
							<View className='flex-row items-center gap-2 mb-4'>
								{training.days.map((day: string, index: number) => (
									<Text
										key={index}
										className='py-1 px-3 bg-background rounded-full border border-secondary text-secondary font-sregular text-xs'
									>
										{DAYS_TRANSLATION.find((d) => d.value === day)?.label ||
											day}
									</Text>
								))}
							</View>
						)}
						<FlatList
							data={trainingExercises}
							renderItem={renderExerciseItem}
							keyExtractor={(item) => item.name}
							showsVerticalScrollIndicator={false}
							ListEmptyComponent={
								<Text className='indicator-text'>Aucun exercice</Text>
							}
						/>
					</View>

					{relatedGoals !== null && relatedGoals.length > 0 && (
						<View>
							<Text className='title-3 mb-3'>
								Objectifs liés à l&apos;entrainement
							</Text>
							{relatedGoals.map((item: Goal) => (
								<FlatList
									key={item.$id}
									data={relatedGoals}
									renderItem={renderGoalItem}
									keyExtractor={(item) => item.title}
									showsVerticalScrollIndicator={false}
								/>
							))}
						</View>
					)}
				</>
			)}
		</SafeAreaView>
	);
};

export default Index;
