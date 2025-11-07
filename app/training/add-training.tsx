import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import { DAYS_TRANSLATION } from "@/constants/value";
import { createSeries } from "@/lib/series.appwrite";
import { createTraining } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import useSeriesStore from "@/store/series.store";
import { createTrainingParams, Training } from "@/types";
import { CreateSeriesParams, SeriesParams } from "@/types/series";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import SeriesFormModal from "./components/SeriesFormModal";
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
	};

	const handleSeriesCreated = ( series: Omit<CreateSeriesParams, 'training' | 'order'> ) => {
		setSeriesList( prev => [ ...prev, series ] );
	};

	const handleSeriesListChange = ( newList: Omit<CreateSeriesParams, 'training' | 'order'>[] ) => {
		setSeriesList( newList );
	};

	const submit = async (): Promise<void> => {
		if ( !form.name || !form.days || form.days.length === 0 ) {
			Alert.alert( "Erreur", "Veuillez remplir tous les champs obligatoires" );
			return;
		}

		if ( seriesList.length === 0 ) {
			Alert.alert( "Erreur", "Veuillez ajouter au moins une série à votre entraînement" );
			return;
		}

		const hours = form.hours || 0;
		const minutes = form.minutes || 0;
		const totalDuration = hours * 60 + minutes;

		const trainingData: createTrainingParams = {
			name: form.name,
			days: form.days,
			duration: totalDuration,
		};

		try {
			setIsSubmitting( true );
			const response = await createTraining( trainingData );
			const training = response.training as any as Training;

			// Créer les séries avec le bon ordre
			for ( let i = 0; i < seriesList.length; i++ ) {
				const series = seriesList[ i ];
				const seriesResponse = await createSeries( {
					...series,
					training: training.$id,
					order: i + 1 // L'ordre commence à 1 et suit l'ordre du tableau
				} );

				const newSeries = seriesResponse.series as any as SeriesParams;
				addSeriesStore( newSeries );
			}

			// Ajouter l'entraînement au store
			const newTraining: Training = {
				$id: training.$id,
				user: training.user,
				name: training.name,
				days: training.days,
				duration: training.duration,
			};
			addTrainingStore( newTraining );

			// Redirection vers la liste des entraînements
			router.push( "/trainings" );
		} catch ( err ) {
			console.error( "Erreur lors de la création de l'entraînement:", err );
			Alert.alert( "Erreur", "Échec de l'ajout. Réessayez." );
		} finally {
			setIsSubmitting( false );
		}
	};

	return (
		<View className='flex-1 bg-background min-h-full px-5'>
			<View className="flex-1">
				<View className=' flex-1 flex-col gap-5 pb-5'>
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

					<View className="flex-1">
						<Text className="text-primary font-sregular text-lg mb-3">
							Mes séries ({ seriesList.length })
						</Text>

						{ seriesList.length > 4 && (
							<Text className='text-sm text-primary-100 font-sregular mb-4'>
								Attention, avoir trop d&apos;exercices différents dans son entraînement n&apos;est
								pas forcément une bonne chose
							</Text>
						) }

						{ seriesList.length > 0 && (
							<SeriesItemList
								seriesList={ seriesList }
								onSeriesListChange={ handleSeriesListChange }
							/>
						) }
					</View>
				</View>
			</View>

			<View className="pb-5">
				<CustomButton
					title='Ajouter une série'
					variant='secondary'
					onPress={ handleModalVisibility }
					customStyles="mb-3"
				/>

				<CustomButton
					title="Créer l'entraînement"
					onPress={ submit }
					isLoading={ isSubmitting }
				/>
			</View>

			<SeriesFormModal
				isVisible={ isModalVisible }
				closeModal={ handleModalVisibility }
				onSeriesCreated={ handleSeriesCreated }
			/>
		</View>
	);
};

export default AddTraining;