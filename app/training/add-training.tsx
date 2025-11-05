import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import { DAYS_TRANSLATION } from "@/constants/value";
import { createTraining } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import { createTrainingParams, Exercise, Training } from "@/types";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

import ExerciseItem from "../exercise/components/ExerciseItem";
import ExerciseSelectionModal from "../exercise/components/ExerciseSelectionModal";

const AddTraining = () => {
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
	const { addTrainingStore } = useTrainingsStore();

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

	const submit = async (): Promise<void> => {
		if ( !form.name || !form.days ) {
			Alert.alert( "Erreur", "Veuillez remplir tous les champs" );
			return;
		}

		if ( form.hours === undefined ) {
			form.hours = 0;
		}

		if ( form.minutes === undefined ) {
			form.minutes = 0;
		}

		const totalDuration = form.hours * 60 + form.minutes;

		const exerciseIds = selectedExercises.map( exercise => exercise.$id );

		const trainingData = {
			name: form.name,
			days: form.days,
			duration: totalDuration,
			exercise: exerciseIds,
		};

		try {
			setIsSubmitting( true );
			const response = await createTraining( trainingData );

			if ( response.training ) {
				const newTraining: Training = {
					$id: response.training.$id,
					user: response.training.user,
					name: response.training.name,
					days: response.training.days,
					duration: response.training.duration,
					exercise: response.training.exercise,
				};
				addTrainingStore( newTraining );
			}
			router.push( "/trainings" );
		} catch ( err ) {
			console.error( err );
			Alert.alert( "Erreur", "Échec de l'ajout. Réessayez." );
		} finally {
			setIsSubmitting( false );
		}
	};

	return (
		<View className='flex-1 bg-background min-h-full px-5'>
			<ScrollView className='flex-1'>
				<View className='flex-col gap-5'>
					<CustomInput
						label="Nom de l'entraînement"
						value={ form.name }
						placeholder='Ex : Planche + combo'
						onChangeText={ ( t: string ) => setForm( ( p ) => ( { ...p, name: t } ) ) }
					/>

					<View className='flex-row w-full gap-3'>
						<View className='flex-1'>
							<CustomInput
								label='Heure'
								value={ form.hours !== 0 ? String( form.hours ) : '' }
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
								value={ form.minutes !== 0 ? String( form.minutes ) : '' }
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
									Avoir trop d&apos;exercices dans son entraînement n&apos;est
									pas forcément une bonne chose
								</Text>
							) }

							{ selectedExercises.map( ( exercise, index ) => (
								<ExerciseItem
									key={ exercise.$id }
									image={ exercise.image }
									name={ exercise.name }
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
				title="Créer l'entraînement"
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
		</View>
	);
};

export default AddTraining;
