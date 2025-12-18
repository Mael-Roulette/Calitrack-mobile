import CustomButton from "@/components/CustomButton";
import {
	getTrainingById
} from "@/lib/training.appwrite";
import { useGoalsStore, useTrainingsStore } from "@/store";
import { Training } from "@/types";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import SessionSummary from "../components/session/SessionSummary";
import { SeriesParams } from "@/types/series";
import SessionSerie from "../components/session/SessionSerie";

const Session = () => {
	const { id } = useLocalSearchParams();
	const { getById, addTrainingStore } = useTrainingsStore();
	const [ isTrainingLoading, setIsTrainingLoading ] = useState( true );
	const [ training, setTraining ] = useState<Training>();
	const navigation = useNavigation();
	const { goals } = useGoalsStore();
	const [ isSessionLaunched, setIsSessionLaunched ] = useState<boolean>( false );
	// const { user, refreshUser } = useAuthStore();

	/* -------------------------------------------------- */
	/* ---------- Récupérer les informations de l'entraînement ---------- */
	// Chargement de l'entrainement
	useEffect( () => {
		const load = async () => {
			const cached = getById( id as string );

			if ( cached ) {
				setTraining( cached );
				setIsTrainingLoading( false );
				return;
			}

			// Fallback API si pas encore chargé
			try {
				setIsTrainingLoading( true );
				const training = await getTrainingById( id as string ) as any as Training;
				setTraining( training );

				// mise dans le store
				addTrainingStore( training );

			} catch {
				router.push( "/trainings" );
			} finally {
				setIsTrainingLoading( false );
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

	const handleSessionLaunch = () => {
		setIsSessionLaunched( true );
	}

	// /* ----- Méthode pour gérer la fin de l'entraînement ----- */
	// const handleEndTraining = async () => {
	// 	if ( !user?.$id ) {
	// 		console.error( "Utilisateur non connecté" );
	// 		router.push( "/trainings" );
	// 		return;
	// 	}

	// 	setIsFinishing( true );

	// 	try {
	// 		await incrementUserTrainings( user.$id );
	// 		await refreshUser();
	// 	} catch ( error ) {
	// 		console.error( "Erreur lors de la sauvegarde:", error );
	// 	} finally {
	// 		setIsFinishing( false );
	// 		router.push( "/trainings" );
	// 	}
	// };

	if ( isTrainingLoading && !training ) {
		return (
			<View className='flex-1 justify-center items-center'>
				<Text className='mt-2 text-primary'>La récupération de l&apos;entraînement a échoué.</Text>
				<Link href={ "/" }>Revenir à l&apos;accueil</Link>
			</View>
		)
	}

	return (
		<View className="flex-1 bg-background ">
			<ScrollView className='flex-1' contentContainerStyle={ { paddingBottom: 20 } }>
				{ isTrainingLoading ? (
					<View className='flex-1 justify-center items-center'>
						<ActivityIndicator size='large' color='#FC7942' />
						<Text className='mt-2 text-primary'>Chargement...</Text>
					</View>
				) : !isTrainingLoading && training && !isSessionLaunched && (
					<SessionSummary training={ training } goals={ goals } />
				) }

				{ isSessionLaunched &&
					training?.series?.map( ( serie: SeriesParams ) => {
						return (
							<SessionSerie key={ serie.$id } />
						)
					} )
				}
			</ScrollView>

			<View className='px-5 mb-5'>
				<CustomButton
					onPress={ handleSessionLaunch }
					title='C&apos;est parti !'
				/>
			</View>
		</View>
	);
};

export default Session;
