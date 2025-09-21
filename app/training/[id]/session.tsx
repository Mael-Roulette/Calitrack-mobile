import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import GoalItem from "@/app/goal/components/GoalItem";
import CustomButton from "@/components/CustomButton";
import { DAYS_TRANSLATION } from "@/constants/value";
import {
	getTrainingById,
	incrementUserTrainings,
} from "@/lib/training.appwrite";
import { useAuthStore, useGoalsStore } from "@/store";
import { Exercise, Goal } from "@/types";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";


const Session = () => {
	const { id } = useLocalSearchParams();
	const { user, refreshUser } = useAuthStore();
	const [ training, setTraining ] = useState<any>( null );
	const [ loading, setLoading ] = useState( true );
	const [ trainingExercises, setTrainingExercises ] = useState<Exercise[]>( [] );
	const [ isFinishing, setIsFinishing ] = useState( false );
	const navigation = useNavigation();
	const { goals } = useGoalsStore();
	const [ relatedGoals, setRelatedGoals ] = useState<Goal[]>( [] );

	/* -------------------------------------------------- */
	/* ---------- Récupérer les informations de l'entrainement ---------- */
	useEffect( () => {
		const fetchTraining = async () => {
			setLoading( true );
			try {
				const response = await getTrainingById( id as string );
				setTraining( response );
			} catch ( error ) {
				console.error(
					"Erreur lors de la récupération de l'entrainement",
					error
				);
				router.push( "/trainings" );
			} finally {
				setLoading( false );
			}
		};
		fetchTraining();
	}, [ id, router ] );

	/* ----- Modification du custom header ----- */
	useLayoutEffect( () => {
		navigation.setOptions( {
			headerTitle: () => (
				<Text
					className='title text-ellipsis overflow-hidden max-w-60'
					numberOfLines={ 1 }
				>
					{ training?.name || "Entrainement" }
				</Text>
			),
		} );
	}, [ navigation, training ] );

	/* ----- Affichage des bons exercices ----- */
	useEffect( () => {
		if ( training && training.exercise ) {
			setTrainingExercises( training.exercise );
		}
	}, [ training ] );

	const renderExerciseItem = ( { item }: { item: Exercise } ) => (
		<ExerciseItem
			name={ item.name }
			type={ item.type.name }
			difficulty={ item.difficulty }
			onPress={ () => goToExerciseDetails( item.$id ) }
		/>
	);

	const goToExerciseDetails = ( id: string ) => {
		router.push( {
			pathname: "/exercise/[id]",
			params: { id },
		} );
	};

	/* ----- Afficher les objectifs liés à l'entrainement ----- */
	useEffect( () => {
		if ( !trainingExercises.length || !goals.length ) return;

		const exerciseTypes = new Set(
			trainingExercises.map( ( exercise ) =>
				typeof exercise.type.name === "string"
					? exercise.type.name
					: exercise.type.name
			)
		);

		const matchingGoals = goals.filter(
			( goal ) =>
				exerciseTypes.has( goal.type.name ) && goal.state === "in-progress"
		);

		setRelatedGoals( matchingGoals );
	}, [ trainingExercises, goals ] );

	const renderGoalItem = ( { item }: { item: Goal } ) => (
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
	);

	/* ----- Méthode pour gérer la fin de l'entrainement ----- */
	const handleEndTraining = async () => {
		if ( !user?.$id ) {
			console.error( "Utilisateur non connecté" );
			router.push( "/trainings" );
			return;
		}

		setIsFinishing( true );

		try {
			await incrementUserTrainings( user.$id );
			await refreshUser();
		} catch ( error ) {
			console.error( "Erreur lors de la sauvegarde:", error );
		} finally {
			setIsFinishing( false );
			router.push( "/trainings" );
		}
	};

	return (
		<View className='bg-background min-h-full px-5'>
			{ loading ? (
				<View className='flex-1 justify-center items-center'>
					<ActivityIndicator size='large' color='#FC7942' />
					<Text className='mt-2 text-primary'>Chargement...</Text>
				</View>
			) : (
				<View className='flex-1 h-full'>
					<View className='flex-1 h-full'>
						<View>
							<Text className='text-lg font-sregular text-primary mb-2'>
								Durée:{ " " }
								{ training?.duration < 60
									? `${training?.duration} minutes`
									: `${Math.floor( ( training?.duration ?? 0 ) / 60 )}h${( training?.duration ?? 0 ) % 60 === 0 ? "" : ( training?.duration ?? 0 ) % 60}` }
							</Text>
							{ training.days.length > 0 && (
								<View className='flex-row items-center gap-2 mb-4'>
									{ training.days.map( ( day: string, index: number ) => (
										<Text
											key={ index }
											className='py-1 px-3 bg-background rounded-full border border-secondary text-secondary font-sregular text-xs'
										>
											{ DAYS_TRANSLATION.find( ( d ) => d.value === day )?.label ||
												day }
										</Text>
									) ) }
								</View>
							) }
							<FlatList
								data={ trainingExercises }
								renderItem={ renderExerciseItem }
								keyExtractor={ ( item ) => item.name }
								showsVerticalScrollIndicator={ false }
								ListEmptyComponent={
									<Text className='indicator-text'>Aucun exercice</Text>
								}
							/>
						</View>

						{ relatedGoals !== null && relatedGoals.length > 0 && (
							<View>
								<Text className='title-3 mb-3'>
									Objectifs liés à l&apos;entrainement
								</Text>
								{ relatedGoals.map( ( item: Goal ) => (
									<FlatList
										key={ item.$id }
										data={ relatedGoals }
										renderItem={ renderGoalItem }
										keyExtractor={ ( item ) => item.title }
										showsVerticalScrollIndicator={ false }
									/>
								) ) }
							</View>
						) }
					</View>

					<View className='my-5'>
						<CustomButton
							title='Entrainement terminé !'
							onPress={ handleEndTraining }
							isLoading={ isFinishing }
						/>
					</View>
				</View>
			) }
		</View>
	);
};

export default Session;
