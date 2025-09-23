import { ScrollView, Text, View } from "react-native";

import CustomCalendar from "../calendar/components/CustomCalendar";
import TrainingItem from "../training/components/TrainingItem";
import { useEffect, useState } from "react";
import { getTrainingFromUserByDay } from "@/lib/training.appwrite";
import cn from 'clsx';
import { Training } from "@/types";

const Calendar = () => {
	const [ upcomingTrainings, setUpcomingTrainings ] = useState<any[]>( [] );
	const [ isLoading, setIsLoading ] = useState( true );

	const getDayInEnglish = ( date: Date ) => {
		const days = [
			"sunday",
			"monday",
			"tuesday",
			"wednesday",
			"thursday",
			"friday",
			"saturday",
		];
		return days[ date.getDay() ];
	};

	const formatDate = ( date: Date ) => {
		const days = [
			"Dimanche",
			"Lundi",
			"Mardi",
			"Mercredi",
			"Jeudi",
			"Vendredi",
			"Samedi",
		];

		return `${days[ date.getDay() ]}`;
	};

	useEffect( () => {
		const fetchUpcomingTrainings = async () => {
			try {
				setIsLoading( true );
				const nextDays = [];
				const currentDate = new Date();

				for ( let i = 0; i <= 2; i++ ) {
					const nextDate = new Date();
					nextDate.setDate( currentDate.getDate() + i );

					const dayName = getDayInEnglish( nextDate );
					const trainings = await getTrainingFromUserByDay( dayName );

					nextDays.push( {
						date: nextDate,
						trainings: trainings || [],
					} );
				}

				setUpcomingTrainings( nextDays );
			} catch ( error ) {
				console.error( "Error fetching upcoming trainings:", error );
			} finally {
				setIsLoading( false );
			}
		};

		fetchUpcomingTrainings();
	}, [] );

	return (
		<View className='px-5 bg-background flex-1'>
			<ScrollView>

				<CustomCalendar />

				<View className='mt-10'>
					{ isLoading ? (
						<Text className='indicator-text'>Chargement des entraînements...</Text>
					) : (
						upcomingTrainings.map( ( item: any, index: number ) => {
							const isFirstDay = index === 0;
							const formattedDate = isFirstDay ? "Entraînement du jour" : formatDate( item.date );

							return (
								<View
									key={ `${item.date.getTime()}-${index}` }
									className={ index > 0 ? "mt-5" : "" }
								>
									<Text className={ cn( 'text-primary font-calsans mb-3', isFirstDay ? 'text-2xl' : 'text-xl' ) }>
										{ formattedDate }
									</Text>
									{ item.trainings.length > 0 ? (
										<>
											{ item.trainings.map(
												( training: Training, trainingIndex: number ) => (
													<View
														key={ `${item.date.getTime()}-${training.$id}-${trainingIndex}` }
														className={ trainingIndex > 0 ? "mt-3" : "" }
													>
														<TrainingItem
															id={ training.$id }
															title={ training.name }
															duration={ training.duration }
															isTrainingDay={ isFirstDay }
														/>
													</View>
												)
											) }
										</>
									) : (
										<Text className='indicator-text mb-3'>
											Aucun entraînement prévu.
										</Text>
									) }
								</View>
							);
						} )
					) }
				</View>
			</ScrollView>
		</View>
	);
};

export default Calendar;
