import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import { DAYS_TRANSLATION } from "@/constants/value";
import { createTraining } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import { createTrainingParams, Training } from "@/types";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import SeriesFormModal from "./components/SeriesFormModal";
import { CreateSeriesParams, SeriesParams } from "@/types/series";
import { createSeries } from "@/lib/series.appwrite";
import useSeriesStore from "@/store/series.store";
import SeriesItemEdit from "./components/SeriesItemEdit";
import DraggableFlatList, { ScaleDecorator } from "react-native-draggable-flatlist";
import SeriesItemList from "./components/SeriesItemList";

const AddTraining = () => {
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );
	const [ selectedDays, setSelectedDays ] = useState<string[]>( [] );
	const [ isModalVisible, setIsModalVisible ] = useState<boolean>( false );
	const [ seriesList, setSeriesList ] = useState<Omit<CreateSeriesParams, 'training' | 'order'>[]>( [] );
	const [ form, setForm ] = useState<Partial<createTrainingParams>>( {
		name: "",
		days: [],
		hours: 0,
		minutes: 0,
	} );
	const { addTrainingStore } = useTrainingsStore();
	const { addSeriesStore } = useSeriesStore();

	const handleModalVisibility = () => {
		setIsModalVisible( !isModalVisible );
	}

	const handleSeriesCreated = ( series: Omit<CreateSeriesParams, 'training' | 'order'> ) => {
		const newSeries = {
			...series
		};
		setSeriesList( prev => [ ...prev, newSeries ] );
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

		const trainingData: createTrainingParams = {
			name: form.name,
			days: form.days,
			duration: totalDuration,
		};

		try {
			setIsSubmitting( true );
			const response = await createTraining( trainingData );
			const training = response.training as any as Training;

			for ( const series of seriesList ) {
				let seriesOrder = 1;
				const response = await createSeries( {
					...series,
					training: training.$id,
					order: seriesOrder
				} )

				seriesOrder++;

				const newSeries = response.series as any as SeriesParams;

				addSeriesStore( newSeries );
			}

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
						<Text className="text">Mes séries ( { seriesList.length } )</Text>

						{ seriesList.length > 0 && (
							<View>
								<View>
									{
										seriesList.length > 4 && (
											<Text className='indicator-text mt-2 mb-4'>
												Attention, avoir trop d&apos;exercices différents dans son entraînement n&apos;est
												pas forcément une bonne chose
											</Text>
										)
									}
								</View>

								<View>
									<SeriesItemList />
								</View>
							</View>
						) }

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
				onSeriesCreated={ handleSeriesCreated }
			/>
		</View>
	);
};

export default AddTraining;