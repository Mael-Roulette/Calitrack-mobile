import { createSeries } from "@/lib/series.appwrite";
import { createTraining } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import { createTrainingParams, Training } from "@/types";
import { SeriesParams } from "@/types/series";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, View } from "react-native";
import TrainingForm, { MixSeriesType } from "./components/TrainingForm";

const AddTraining = () => {
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );

	// Fonction store
	const { addTrainingStore } = useTrainingsStore();


	// Envoie du formulaire pour la création de l'entraînement
	const submit = async ( { form, seriesList }: { form: Partial<createTrainingParams>, seriesList: MixSeriesType[] } ): Promise<void> => {
		// Vérification des champs aléatoires
		if ( !form.name || !form.days || form.days.length === 0 ) {
			Alert.alert( "Erreur", "Veuillez remplir tous les champs obligatoires" );
			return;
		}

		// Récupération des données du formulaire
		const trainingData: createTrainingParams = {
			name: form.name,
			days: form.days,
			duration: form.duration!,
		};

		try {
			setIsSubmitting( true );
			// Création et récupération de l'entraînement
			const response = await createTraining( trainingData );
			const training = response.training as any as Training;

			// Création des séries (s'ajoute automatiquement dans les entrainements)
			let newSeriesList: SeriesParams[] = [];
			if ( seriesList.length > 0 ) {
				for ( let i = 0; i < seriesList.length; i++ ) {
					const series = seriesList[ i ];
					const seriesResponse = await createSeries( {
						...series,
						training: training.$id, // Ajout de l'id de l'entrainement
						order: i + 1, // Ajout de l'ordre
					} );

					// Ajout des séries dans le store
					const newSeries = seriesResponse.series as any as SeriesParams;
					newSeriesList.push( newSeries );
				}
			}

			// Ajout du training dans le store
			const newTraining: Training = {
				$id: training.$id,
				user: training.user,
				name: training.name,
				days: training.days,
				duration: training.duration,
				series: newSeriesList
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
			<TrainingForm
				onSubmit={ () => submit() }
				submitButtonText="Créer l'entraînement"
				isSubmitting={ isSubmitting }
			/>
		</View>
	);
};

export default AddTraining;