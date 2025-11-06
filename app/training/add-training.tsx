import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import { DAYS_TRANSLATION } from "@/constants/value";
import { createTraining } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import { createTrainingParams, Training } from "@/types";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, View, Text } from "react-native";
import SeriesFormModal from "./components/SeriesFormModal";
import SeriesItem from "./components/SeriesItem";

const AddTraining = () => {
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );
	const [ selectedDays, setSelectedDays ] = useState<string[]>( [] );
	const [ isModalVisible, setIsModalVisible ] = useState<boolean>( false );
	const [ form, setForm ] = useState<Partial<createTrainingParams>>( {
		name: "",
		days: [],
		hours: 0,
		minutes: 0,
	} );
	const { addTrainingStore } = useTrainingsStore();

	const handleModalVisibility = () => {
		setIsModalVisible( !isModalVisible );
	}

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

		const trainingData: createTrainingParams = {
			name: form.name,
			days: form.days,
			duration: totalDuration,
		};

		try {
			setIsSubmitting( true );
			const response = await createTraining( trainingData );
			const training = response.training as any as Training;

			if ( training ) {
				const newTraining: Training = {
					$id: training.$id,
					user: training.user,
					name: training.name,
					days: training.days,
					duration: training.duration,
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

					<View>
						<Text className="text">Mes séries (0)</Text>
						{/* <SeriesItem
							state="view"
						/> */}
					</View>
				</View>
			</ScrollView>

			<CustomButton
				title='Ajouter une série'
				variant='secondary'
				onPress={ handleModalVisibility }
			/>

			<CustomButton
				title="Créer l'entraînement"
				onPress={ submit }
				isLoading={ isSubmitting }
				customStyles='my-5'
			/>
			<SeriesFormModal
				isVisible={ isModalVisible }
				closeModal={ handleModalVisibility }
			/>
		</View>
	);
};

export default AddTraining;