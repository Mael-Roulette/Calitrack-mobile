import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import CustomTags from "@/components/CustomTags";
import CustomTimePicker from "@/components/CustomTimePicker";
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
	const [ seriesList, setSeriesList ] = useState<
		Omit<CreateSeriesParams, "training" | "order">[]
	>( [] );

	// États pour l'édition
	const [ editingSeries, setEditingSeries ] = useState<Omit<CreateSeriesParams, "training" | "order"> | null>( null );
	const [ editingIndex, setEditingIndex ] = useState<number | null>( null );

	const [ form, setForm ] = useState<Partial<createTrainingParams>>( {
		name: "",
		days: [],
		duration: 0,
	} );

	const { addTrainingStore } = useTrainingsStore();
	const { addSeriesStore } = useSeriesStore();

	const handleModalVisibility = () => {
		// Réinitialiser les états d'édition lors de l'ouverture pour une nouvelle série
		if ( !isModalVisible ) {
			setEditingSeries( null );
			setEditingIndex( null );
		}
		setIsModalVisible( !isModalVisible );
	};

	const handleSeriesCreated = (
		series: Omit<CreateSeriesParams, "training" | "order">
	) => {
		setSeriesList( ( prev ) => [ ...prev, series ] );
	};

	const handleSeriesUpdated = (
		series: Omit<CreateSeriesParams, "training" | "order">,
		index: number
	) => {
		setSeriesList( ( prev ) => {
			const newList = [ ...prev ];
			newList[ index ] = series;
			return newList;
		} );
	};

	const handleEditSeries = ( index: number ) => {
		setEditingSeries( seriesList[ index ] );
		setEditingIndex( index );
		setIsModalVisible( true );
	};

	const handleSeriesListChange = (
		newList: Omit<CreateSeriesParams, "training" | "order">[]
	) => {
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

		const trainingData: createTrainingParams = {
			name: form.name,
			days: form.days,
			duration: form.duration!,
		};

		try {
			setIsSubmitting( true );
			const response = await createTraining( trainingData );
			const training = response.training as any as Training;

			// Créer les séries
			for ( let i = 0; i < seriesList.length; i++ ) {
				const series = seriesList[ i ];
				const seriesResponse = await createSeries( {
					...series,
					training: training.$id,
					order: i + 1,
				} );

				const newSeries = seriesResponse.series as any as SeriesParams;
				addSeriesStore( newSeries );
			}

			const newTraining: Training = {
				$id: training.$id,
				user: training.user,
				name: training.name,
				days: training.days,
				duration: training.duration,
			};

			addTrainingStore( newTraining );
			router.push( "/trainings" );
		} catch ( err ) {
			console.error( "Erreur lors de la création de l'entraînement:", err );
			Alert.alert( "Erreur", "Échec de l'ajout. Réessayez." );
		} finally {
			setIsSubmitting( false );
		}
	};

	return (
		<View className="flex-1 bg-background min-h-full px-5">
			<View className="flex-1">
				<View className=" flex-1 flex-col gap-5 pb-5">
					<CustomInput
						label="Nom de l'entraînement"
						value={ form.name }
						placeholder="Ex : Planche + combo"
						onChangeText={ ( t: string ) =>
							setForm( ( p ) => ( { ...p, name: t } ) )
						}
					/>

					<CustomTimePicker
						label="Durée de la séance"
						value={ form.duration || 0 }
						onChange={ ( durationMinutes ) =>
							setForm( ( p ) => ( { ...p, duration: durationMinutes } ) )
						}
					/>

					<CustomTags
						label="Jours de disponibilité"
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
							<Text className="text-sm text-primary-100 font-sregular mb-4">
								Attention, avoir trop d&apos;exercices différents dans son
								entraînement n&apos;est pas forcément une bonne chose
							</Text>
						) }

						{ seriesList.length > 0 && (
							<SeriesItemList
								seriesList={ seriesList }
								onSeriesListChange={ handleSeriesListChange }
								onEditSeries={ handleEditSeries }
							/>
						) }
					</View>
				</View>
			</View>

			<View className="pb-5">
				<CustomButton
					title="Ajouter une série"
					variant="secondary"
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
				editingSeries={ editingSeries }
				editingIndex={ editingIndex }
				onSeriesUpdated={ handleSeriesUpdated }
			/>
		</View>
	);
};

export default AddTraining;