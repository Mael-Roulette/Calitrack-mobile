import CustomButton from "@/components/CustomButton";
import { useAuthStore, useGoalsStore, useTrainingsStore } from "@/store";
import { Goal } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Modal, ScrollView, Text, View } from "react-native";
import GoalItem from "../goal/components/GoalItem";
import { getTrainingFromUserByDay } from "@/lib/training.appwrite";
import TrainingItem from "../training/components/TrainingItem";
import useExercicesStore from "@/store/exercises.stores";
import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_LAUNCH_KEY = '@first_launch_done';

export default function Index () {
	const [ showWelcomeModal, setShowWelcomeModal ] = useState( false );
	const { user, isLoading } = useAuthStore();
	const { goals, isLoadingGoals, fetchUserGoals } = useGoalsStore();
	const { fetchUserTrainings } = useTrainingsStore();
	const { fetchExercises } = useExercicesStore();
	const [ todayTraining, setTodayTraining ] = useState<any>( [] );

	if ( !user ) {
		router.replace( "/(auth)" );
	}

	// Lancement de la vérification de first launch
	useEffect( () => {
		checkFirstLaunch();
	}, [] );

	const checkFirstLaunch = async () => {
		try {
			// Récupère la clé du local storage
			const hasLaunched = await AsyncStorage.getItem( FIRST_LAUNCH_KEY );

			if ( hasLaunched === null ) {
				// Premier lancement
				setShowWelcomeModal( true );
				await AsyncStorage.setItem( FIRST_LAUNCH_KEY, 'false' ); // TODO passer à true
			}
		} catch ( error ) {
			console.error( 'Erreur lors de la vérification du premier lancement:', error );
		}
	};

	// Fermeture de la modal de bienvenue
	const handleCloseModal = () => {
		setShowWelcomeModal( false );
	};

	// Date du jour
	const today = new Date()
		.toLocaleDateString( "en-EN", {
			weekday: "long",
		} )
		.toLowerCase();

	// Récupérer le training du jour
	useEffect( () => {
		const fetchTodayTraining = async () => {
			try {
				const training = await getTrainingFromUserByDay( today );
				if ( training.length > 0 ) {
					setTodayTraining( training[ 0 ] );
				}
			} catch ( error ) {
				console.error( "Erreur lors de la récupération de l'entraînement du jour :", error );
			}
		};

		fetchTodayTraining();
	}, [ today ] );

	const goToCalendar = () => {
		router.push( "/calendar" );
	};

	useEffect( () => {
		fetchUserGoals();
		fetchUserTrainings();
		fetchExercises();
	}, [ fetchUserGoals, fetchUserTrainings, fetchExercises ] );

	const { progressGoals } = useMemo(
		() => ( {
			progressGoals: goals.filter( ( goal: Goal ) => goal.state === "in-progress" ),
		} ),
		[ goals ]
	);

	return (
		<View className='bg-background min-h-full'>
			{ isLoading ? (
				<View>
					<Text className='title'>Chargement...</Text>
				</View>
			) : (
				<ScrollView showsVerticalScrollIndicator={ true } className='flex-1 px-5'>
					<Modal
						animationType="fade"
						transparent={ true }
						visible={ showWelcomeModal }
						onRequestClose={ handleCloseModal }
						className="rounded-md shadow"
					>
						<View className="space-y-2">
							<Text className="title-2">Bienvenue ! 🎉</Text>
							<Text className="text">Merci d&apos;avoir rejoint la version bêta de l&apos;application !</Text>
							<Text className="text">Avant de commencer, voici quelques points importants :</Text>
							<Text className="text">Cette application est encore en phase de test, ce qui signifie que tu pourrais rencontrer quelques bugs. N&apos;hésite pas à me les signaler afin que je puisse les corriger rapidement.</Text>
							<Text className="text">Les fonctionnalités actuelles sont les bases de l&apos;application — ton avis est précieux pour les améliorer et en ajouter de nouvelles !</Text>
							<Text className="text">Enfin, garde à l&apos;esprit que toutes les données que tu saisis pendant la bêta pourraient être supprimées à la fin de cette phase.</Text>
							<Text className="text">Merci encore pour ta participation et ton aide !</Text>
							<CustomButton
								title="Commencer"
								onPress={ handleCloseModal }
							/>
						</View>
					</Modal>
					<View>
						<Text className='text-2xl text-primary font-calsans mb-3'>
							Entraînement du jour
						</Text>
						{ todayTraining !== null && todayTraining.$id ? (
							<TrainingItem
								id={ todayTraining.$id }
								title={ todayTraining.name }
								duration={ todayTraining.duration }
								isTrainingDay={ true }
							/>
						) : (
							<Text className='indicator-text'>
								Aucun entraînement prévu pour aujourd&apos;hui.
							</Text>
						) }

						<CustomButton
							title='Voir mon planning'
							variant='secondary'
							customStyles='mt-5'
							onPress={ goToCalendar }
						/>
					</View>

					<View>
						<View className='flex-row gap-2 items-center mt-8 mb-4'>
							<Feather name='target' size={ 24 } color='#FC7942' />
							<Text className='text-2xl font-calsans text-primary'>
								Mes objectifs en cours
							</Text>
						</View>

						{ isLoadingGoals ? (
							<View>
								<Text className='indicator-text'>
									Chargement...
								</Text>
							</View>
						) : (
							<View>
								{ progressGoals.map( ( item: Goal ) => (
									<GoalItem
										key={ item.$id }
										$id={ item.$id }
										title={ item.title }
										type={ item.type }
										progress={ item.progress }
										progressHistory={ item.progressHistory }
										total={ item.total }
										state={ item.state }
										$createdAt={ item.$createdAt }
										$updatedAt={ item.$updatedAt }
									/>
								) ) }
								{ progressGoals.length === 0 && (
									<Text className='indicator-text'>
										Aucun objectif en cours.
									</Text>
								) }
							</View>
						) }
					</View>
				</ScrollView>
			) }
		</View>
	);
}
