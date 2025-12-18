import CustomButton from "@/components/CustomButton";
import { getTrainingById, incrementUserTrainings } from "@/lib/training.appwrite";
import { useAuthStore, useGoalsStore, useTrainingsStore } from "@/store";
import { Training } from "@/types";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import SessionActive from "../components/session/SessionActive";
import SessionRecap from "../components/session/SessionRecap";
import SessionSummary from "../components/session/SessionSummary";
import { SafeAreaView } from "react-native-safe-area-context";

type SessionState = "summary" | "active" | "completed";

const Session = () => {
	const { id } = useLocalSearchParams();
	const { getById, addTrainingStore } = useTrainingsStore();
	const [ isTrainingLoading, setIsTrainingLoading ] = useState<boolean>( true );
	const [ isFinishing, setIsFinishing ] = useState<boolean>( false );
	const [ training, setTraining ] = useState<Training>();
	const navigation = useNavigation();
	const { user, refreshUser } = useAuthStore();
	const { goals } = useGoalsStore();

	// États de la session
	const [ sessionState, setSessionState ] = useState<SessionState>( "summary" );
	const [ currentSeriesIndex, setCurrentSeriesIndex ] = useState( 0 );
	const [ sessionStartTime, setSessionStartTime ] = useState<Date>();

	/* ---------- Récupérer les informations de l'entraînement ---------- */
	useEffect( () => {
		const load = async () => {
			const cached = getById( id as string );

			if ( cached ) {
				setTraining( cached );
				setIsTrainingLoading( false );
				return;
			}

			try {
				setIsTrainingLoading( true );
				const training = await getTrainingById( id as string ) as any as Training;
				setTraining( training );
				addTrainingStore( training );
			} catch {
				router.push( "/trainings" );
			} finally {
				setIsTrainingLoading( false );
			}
		};

		load();
	}, [ addTrainingStore, getById, id ] );

	/* ----- Modification du header selon l'état de la session ----- */
	useLayoutEffect( () => {
		navigation.setOptions( {
			// Masquer le header si la session est active ou terminée
			headerShown: sessionState === "summary",
			headerTitle: () => (
				<Text
					className='title text-ellipsis overflow-hidden max-w-60'
					numberOfLines={ 1 }
				>
					{ training?.name || "Entraînement" }
				</Text>
			),
		} );
	}, [ navigation, training, sessionState ] );

	const handleSessionStart = () => {
		setSessionState( "active" );
		setSessionStartTime( new Date() );
		setCurrentSeriesIndex( 0 );
	};

	const handleSeriesComplete = () => {
		if ( !training?.series ) return;

		// Passer à la série suivante
		if ( currentSeriesIndex < training.series.length - 1 ) {
			setCurrentSeriesIndex( prev => prev + 1 );
		} else {
			// Toutes les séries sont terminées
			setSessionState( "completed" );
		}
	};

	const handleSessionEnd = async () => {
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

	if ( isTrainingLoading && !training ) {
		return (
			<View className='flex-1 justify-center items-center'>
				<Text className='mt-2 text-primary'>
					La récupération de l&apos;entraînement a échoué.
				</Text>
				<Link href="/">Revenir à l&apos;accueil</Link>
			</View>
		);
	}

	return (
		<SafeAreaView className="flex-1 bg-background" edges={ [ 'top' ] }>
			<View className='flex-1'>
				{ isTrainingLoading ? (
					<View className='flex-1 justify-center items-center'>
						<ActivityIndicator size='large' color='#FC7942' />
						<Text className='mt-2 text-primary'>Chargement...</Text>
					</View>
				) : (
					<>
						{/* Résumé initial */ }
						{ sessionState === "summary" && training && (
							<SessionSummary training={ training } goals={ goals } />
						) }

						{/* Session active */ }
						{ sessionState === "active" && training?.series && (
							<SessionActive
								series={ training.series }
								currentIndex={ currentSeriesIndex }
								onSeriesComplete={ handleSeriesComplete }
							/>
						) }

						{/* Récapitulatif final */ }
						{ sessionState === "completed" && training && sessionStartTime && (
							<SessionRecap
								training={ training }
								startTime={ sessionStartTime }
								endTime={ new Date() }
							/>
						) }
					</>
				) }
			</View>

			{/* Boutons d'action */ }
			<View className='px-5 mb-5'>
				{ sessionState === "summary" && (
					<CustomButton
						onPress={ handleSessionStart }
						title="C'est parti !"
					/>
				) }

				{ sessionState === "completed" && (
					<CustomButton
						onPress={ handleSessionEnd }
						title="Terminer la séance"
						isLoading={ isFinishing }
					/>
				) }
			</View>
		</SafeAreaView>
	);
};

export default Session;