import CustomButton from "@/components/CustomButton";
import { useAuthStore, useGoalsStore, useTrainingsStore } from "@/store";
import { Goal } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import GoalItem from "../goal/components/GoalItem";
import { getTrainingFromUserByDay } from "@/lib/training.appwrite";
import TrainingItem from "../training/components/TrainingItem";
import useExercicesStore from "@/store/exercises.stores";

export default function Index() {
	const { user, isLoading } = useAuthStore();
	const { goals, isLoadingGoals, fetchUserGoals } = useGoalsStore();
	const { fetchUserTrainings } = useTrainingsStore();
	const { fetchExercises } = useExercicesStore();
	const [todayTraining, setTodayTraining] = useState<any>([]);
	const today = new Date()
		.toLocaleDateString("en-EN", {
			weekday: "long",
		})
		.toLowerCase();

	if (!user) {
		router.replace("/(auth)");
	}

	// Récupérer le training du jour
	useEffect(() => {
		const fetchTodayTraining = async () => {
			try {
				const training = await getTrainingFromUserByDay(today);
				if (training.length > 0) {
					setTodayTraining(training[0]);
				}
			} catch (error) {
				console.error("Erreur lors de la récupération de l'entrainement du jour :", error);
			}
		};

		fetchTodayTraining();
	}, [today]);

	const goToCalendar = () => {
		router.push("/calendar");
	};

	useEffect(() => {
		fetchUserGoals();
		fetchUserTrainings();
		fetchExercises();
	}, [fetchUserGoals, fetchUserTrainings, fetchExercises]);

	const { progressGoals } = useMemo(
		() => ({
			progressGoals: goals.filter((goal: Goal) => goal.state === "in-progress"),
		}),
		[goals]
	);

	return (
		<View className='bg-background min-h-full'>
			{isLoading ? (
				<View>
					<Text className='title'>Chargement...</Text>
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={true} className='flex-1 px-5'>
					<View>
						<Text className='text-2xl text-primary font-calsans mb-3'>
							Entrainement du jour
						</Text>
						{todayTraining !== null && todayTraining.$id ? (
							<TrainingItem
								id={todayTraining.$id}
								title={todayTraining.name}
								duration={todayTraining.duration}
								isTrainingDay={true}
							/>
						) : (
							<Text className='indicator-text'>
								Aucun entraînement prévu pour aujourd&apos;hui.
							</Text>
						)}

						<CustomButton
							title='Voir mon planning'
							variant='secondary'
							customStyles='mt-5'
							onPress={goToCalendar}
						/>
					</View>

					<View>
						<View className='flex-row gap-2 items-center mt-8 mb-4'>
							<Feather name='target' size={24} color='#FC7942' />
							<Text className='text-2xl font-calsans text-primary'>
								Mes objectifs en cours
							</Text>
						</View>

						{isLoadingGoals ? (
							<View>
								<Text className='indicator-text'>
									Chargement...
								</Text>
							</View>
						) : (
							<View>
								{progressGoals.map((item: Goal) => (
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
								))}
								{progressGoals.length === 0 && (
									<Text className='indicator-text'>
										Aucun objectif en cours.
									</Text>
								)}
							</View>
						)}
					</View>
				</ScrollView>
			)}
		</View>
	);
}
