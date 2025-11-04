import { View, Text } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import { getTrainingFromUserByDay } from "@/lib/training.appwrite";
import TrainingItem from "../training/components/TrainingItem";
import CustomButton from "@/components/CustomButton";


const Day = () => {
	const { day, month, year } = useLocalSearchParams();
	const navigation = useNavigation();
	const [ dayTrainings, setDayTrainings ] = useState<any[]>( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	/* -------------------------------------------------- */
	/* ---------- Modification du custom header ---------- */
	const formatDate = () => {
		const months = [
			"Janvier",
			"Février",
			"Mars",
			"Avril",
			"Mai",
			"Juin",
			"Juillet",
			"Août",
			"Septembre",
			"Octobre",
			"Novembre",
			"Décembre",
		];

		return `${day} ${months[ Number( month ) - 1 ]} ${year}`;
	};

	useLayoutEffect( () => {
		navigation.setOptions( {
			headerTitle: () => (
				<Text className='title-2'>
					{ formatDate() }
				</Text>
			),
		} );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ navigation ] );

	/* -------------------------------------------------- */
	/* ---------- Récupération des entraînements associé au jour ---------- */
	// TODO : Optimiser le chargement des entrainements
	useEffect( () => {
		const fetchDayTrainings = async () => {
			try {
				setIsLoading( true );

				const selectedDate = new Date(
					Number( year ),
					Number( month ) - 1,
					Number( day )
				);

				const daysOfWeek = [
					"sunday",
					"monday",
					"tuesday",
					"wednesday",
					"thursday",
					"friday",
					"saturday",
				];
				const dayOfWeek = daysOfWeek[ selectedDate.getDay() ];

				const trainings = await getTrainingFromUserByDay( dayOfWeek );

				setDayTrainings( trainings );
			} catch ( error ) {
				console.error(
					"Erreur lors de la récupération des entraînements :",
					error
				);
			} finally {
				setIsLoading( false );
			}
		};

		fetchDayTrainings();
	}, [ day, month, year ] );

	return (
		<View className='flex-1 bg-background px-5'>
			<View className='flex-1'>
				{ isLoading ? (
					<Text>Chargement des entraînements...</Text>
				) : dayTrainings.length > 0 ? (
					dayTrainings.map( ( training, index ) => (
						<TrainingItem
							id={ training.$id }
							key={ `${training.$id}-${index}` }
							title={ training.name }
							days={ training.days }
							duration={ training.duration }
						/>
					) )
				) : (
					<>
						<View className='flex-1 items-center justify-center'>
							<Text className='indicator-text text-center'>
								Aucun entraînement prévu pour cette journée
							</Text>
						</View>
						<View className="flex-col gap-5 mb-10">
							<CustomButton
								title='Modifier un entraînement'
								variant='secondary'
								onPress={ () => router.push( "/trainings" ) }
							/>
							<CustomButton
								title='Créer un entraînement'
								onPress={ () => router.push( "/training/add-training" ) }
							/>
						</View>
					</>
				) }
			</View>
		</View>
	);
};

export default Day;
