import GoalItem from "@/app/goal/components/GoalItem";
import CustomButton from "@/components/CustomButton";
import {
	getTrainingById,
	incrementUserTrainings,
} from "@/lib/training.appwrite";
import { useAuthStore, useGoalsStore, useTrainingsStore } from "@/store";
import { Goal, Training } from "@/types";
import { SeriesParams } from "@/types/series";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import SeriesItem from "../components/SeriesItem";


const Session = () => {
	const { id } = useLocalSearchParams();
	const { user, refreshUser } = useAuthStore();
	const [ training, setTraining ] = useState<Training>();
	const [ loading, setLoading ] = useState( true );
	const [ trainingSeries, setTrainingSeries ] = useState<SeriesParams[]>( [] );
	const [ isFinishing, setIsFinishing ] = useState( false );
	const navigation = useNavigation();
	const { goals } = useGoalsStore();
	const [ relatedGoals, setRelatedGoals ] = useState<Goal[]>( [] );
	const { getById, addTrainingStore } = useTrainingsStore();

	/* -------------------------------------------------- */
	/* ---------- Récupérer les informations de l'entraînement ---------- */
	// Chargement de l'entrainement
	useEffect( () => {
		const load = async () => {
			const cached = getById( id as string );

			if ( cached ) {
				setTraining( cached );
				setLoading( false );
				return;
			}

			// Fallback API si pas encore chargé
			try {
				setLoading( true );
				const training = await getTrainingById( id as string ) as any as Training;
				setTraining( training );

				// mise dans le store
				addTrainingStore( training );

			} catch {
				router.push( "/trainings" );
			} finally {
				setLoading( false );
			}
		};

		load();
	}, [ addTrainingStore, getById, id ] );

	/* ----- Modification du custom header ----- */
	useLayoutEffect( () => {
		navigation.setOptions( {
			headerTitle: () => (
				<Text
					className='title text-ellipsis overflow-hidden max-w-60'
					numberOfLines={ 1 }
				>
					{ training?.name || "Entraînement" }
				</Text>
			),
		} );
	}, [ navigation, training ] );

	/* ----- Affichage des bons exercices ----- */
	useEffect( () => {
		if ( training && training.series ) {
			setTrainingSeries(
				training.series.sort(
					( a: SeriesParams, b: SeriesParams ) => a.order - b.order
				)
			);
		}
	}, [ training ] );

	const renderSeriesItem = ( { item }: { item: SeriesParams } ) => (
		<SeriesItem
			seriesData={ item }
		/>
	);

	/* ----- Afficher les objectifs liés à l'entraînement ----- */
	useEffect( () => {
		if ( !trainingSeries.length || !goals.length ) {
			setRelatedGoals( [] );
			return;
		}

		const exerciseTypes = new Set(
			trainingSeries.map( ex =>
				typeof ex.exercise === "string" ? ex.exercise : ex.exercise.type
			)
		);

		// Filtrer les goals
		const related = goals.filter( goal => ( exerciseTypes.has( goal.exercise.type ) && goal.state === "in-progress" ) );

		setRelatedGoals( related );
	}, [ trainingSeries, goals ] );

	const renderGoalItem = ( { item }: { item: Goal } ) => (
		<GoalItem
			key={ item.$id }
			$id={ item.$id }
			exercise={ item.exercise }
			progress={ item.progress }
			total={ item.total }
			state={ item.state }
		/>
	);

	/* ----- Méthode pour gérer la fin de l'entraînement ----- */
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
		<View className="flex-1 bg-background ">
			<ScrollView className='flex-1' contentContainerStyle={ { paddingBottom: 20 } }>
				{ loading ? (
					<View className='flex-1 justify-center items-center'>
						<ActivityIndicator size='large' color='#FC7942' />
						<Text className='mt-2 text-primary'>Chargement...</Text>
					</View>
				) : !loading && training && (
					<View className="px-5">
						<View>
							<View>
								<Text className='text mb-5'>
									<Text className="title-3">Durée: </Text> { Math.floor( training.duration / 3600 ) > 0
										? `${Math.floor( training.duration / 3600 )}h${Math.floor( ( training.duration % 3600 ) / 60 ) > 0 ? Math.floor( ( training.duration % 3600 ) / 60 ) : ""}`
										: `${Math.floor( ( training.duration % 3600 ) / 60 )} min` }
								</Text>
								<Text className="title-3 mb-3">Mes exercices</Text>
								<FlatList
									data={ trainingSeries }
									renderItem={ renderSeriesItem }
									keyExtractor={ ( item ) => item.$id }
									showsVerticalScrollIndicator={ true }
									scrollEnabled={ false }
									ListEmptyComponent={
										<Text className='indicator-text'>Aucune série</Text>
									}
								/>
							</View>

							{ relatedGoals && relatedGoals.length > 0 && (
								<View className="mt-5">
									<Text className='title-3 mb-3'>
										Objectifs liés à l&apos;entraînement
									</Text>
									<FlatList
										data={ relatedGoals }
										renderItem={ renderGoalItem }
										keyExtractor={ ( item ) => item.exercise.name }
										scrollEnabled={ false }
										showsVerticalScrollIndicator={ false }
									/>
								</View>
							) }

						</View>

					</View>
				) }
			</ScrollView>

			<View className='px-5 mb-5'>
				<CustomButton
					title='Entraînement terminé !'
					onPress={ handleEndTraining }
					isLoading={ isFinishing }
				/>
			</View>
		</View>
	);
};

export default Session;
