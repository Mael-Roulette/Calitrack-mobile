import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import { DAYS_TRANSLATION } from "@/constants/value";
import { getTrainingById, updateTraining } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import { createTrainingParams, Exercise } from "@/types";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	ScrollView,
	Text,
	View,
} from "react-native";
import ExerciseSelectionModal from "../components/ExerciseSelectionModal";


const Edit = () => {
	const { id } = useLocalSearchParams();
	const [ training, setTraining ] = useState<any>( null );
	const [ loading, setLoading ] = useState( true );
	const navigation = useNavigation();
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );
	const [ selectedDays, setSelectedDays ] = useState<string[]>( [] );
	const [ isModalVisible, setIsModalVisible ] = useState<boolean>( false );
	const [ selectedExercises, setSelectedExercises ] = useState<Exercise[]>( [] );
	const [ form, setForm ] = useState<Partial<createTrainingParams>>( {
		name: "",
		days: [],
		hours: 0,
		minutes: 0,
	} );
	const { fetchUserTrainings } = useTrainingsStore();

	/* -------------------------------------------------- */
	/* ---------- Récupérer les informations déjà présentent ---------- */
	useEffect( () => {
		const fetchTraining = async () => {
			setLoading( true );

			try {
				const response = await getTrainingById( id as string );
				setTraining( response );

				setForm( {
					name: response.name,
					days: response.days,
					hours: Math.floor( response.duration / 60 ),
					minutes: response.duration % 60,
				} );

				setSelectedDays( response.days );
				setSelectedExercises( response.exercise );
			} catch ( error ) {
				console.error(
					"Erreur lors de la récupération de l'entraînement",
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
					Modifier : { training?.name || "Entraînement" }
				</Text>
			),
		} );
	}, [ navigation, training, id, router ] );

	/* -------------------------------------------------- */
	/* ---------- Gestion de la modal d'exercices ---------- */
	const openExerciseModal = () => {
		setIsModalVisible( true );
	};

	const closeExerciseModal = () => {
		setIsModalVisible( false );
	};

	const handleExerciseSelection = ( exercises: Exercise[] ) => {
		setSelectedExercises( exercises );
		setIsModalVisible( false );
	};

	/* ----- Fonction d'envoi des modifications ----- */
	const submit = async (): Promise<void> => {
		if ( form.hours === undefined ) {
			form.hours = 0;
		}

		if ( form.minutes === undefined ) {
			form.minutes = 0;
		}

		const totalDuration = form.hours * 60 + form.minutes;

		const exerciseIds = selectedExercises.map( ( exercise ) => exercise.$id );

		const trainingData = {
			id: training.$id,
			name: form.name,
			days: form.days,
			duration: totalDuration,
			exercises: exerciseIds,
		};

		try {
			setIsSubmitting( true );
			await updateTraining( trainingData );
			await fetchUserTrainings();
			router.push( "/trainings" );
		} catch ( err ) {
			console.error( err );
			Alert.alert( "Erreur", "Échec de l'ajout. Réessayez." );
		} finally {
			setIsSubmitting( false );
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
				<>
					<ScrollView className='flex-1'>
						<View className='flex-col gap-5'>
							<CustomInput
								label="Nom de l'entraînement"
								value={ form.name }
								placeholder='Ex : Planche + combo'
								onChangeText={ ( t: string ) =>
									setForm( ( p ) => ( { ...p, name: t } ) )
								}
							/>

							<View className='flex-row w-full gap-3'>
								<View className='flex-1'>
									<CustomInput
										label='Heure'
										value={ String( form.hours ) }
										placeholder='1'
										onChangeText={ ( t: string ) =>
											setForm( ( p ) => ( { ...p, hours: parseInt( t ) || 0 } ) )
										}
										keyboardType='numeric'
									/>
								</View>
								<View className='flex-1'>
									<CustomInput
										label='Minutes'
										value={ String( form.minutes ) }
										placeholder='30'
										onChangeText={ ( t: string ) =>
											setForm( ( p ) => ( { ...p, minutes: parseInt( t ) || 0 } ) )
										}
										keyboardType='numeric'
									/>
								</View>
							</View>

							<CustomTags
								label='Jours de disponibilité'
								placeholder="Sélectionnez vos jours d'entraînement..."
								suggestions={ DAYS_TRANSLATION }
								value={ selectedDays }
								onChangeText={ ( days ) => {
									setSelectedDays( days );
									setForm( ( prev ) => ( { ...prev, days } ) );
								} }
								maxTags={ 7 }
								allowCustomTags={ false }
							/>

							{ selectedExercises.length > 0 && (
								<View className='mb-4'>
									<Text className='text-primary font-calsans text-lg mb-1'>
										Exercices sélectionnés ({ selectedExercises.length })
									</Text>
									{ selectedExercises.length > 4 && (
										<Text className='indicator-text'>
											Avoir trop d&apos;exercices dans son entraînement
											n&apos;est pas forcément une bonne chose
										</Text>
									) }

									{ selectedExercises.map( ( exercise, index ) => (
										<ExerciseItem
											key={ exercise.$id }
											name={ exercise.name }
											type={ exercise.type.name }
											difficulty={ exercise.difficulty }
										/>
									) ) }
								</View>
							) }
						</View>

						<CustomButton
							title={ `${selectedExercises.length > 0 ? "Modifier les" : "Ajouter des"} exercices${selectedExercises.length > 0 ? ` (${selectedExercises.length})` : ""}` }
							variant='secondary'
							onPress={ openExerciseModal }
						/>
					</ScrollView>

					<CustomButton
						title="Modifier l'entraînement"
						onPress={ submit }
						isLoading={ isSubmitting }
						customStyles='mt-5 mb-10'
					/>

					<ExerciseSelectionModal
						isVisible={ isModalVisible }
						onClose={ closeExerciseModal }
						onExerciseSelected={ handleExerciseSelection }
						initialSelectedExercises={ selectedExercises }
					/>
				</>
			) }
		</View>
	);
};

export default Edit;
