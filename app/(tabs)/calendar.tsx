import { ScrollView, Text, View } from "react-native";

import { useTrainingsStore } from "@/store";
import { Training } from "@/types";
import cn from 'clsx';
import { useMemo } from "react";
import CustomCalendar from "../calendar/components/CustomCalendar";
import TrainingItem from "../training/components/TrainingItem";
import { DAYS_EN, DAYS_FR } from "@/constants/value";

const getDayInEnglish = ( date: Date ) => DAYS_EN[ date.getDay() ];
const formatDate = ( date: Date ) => DAYS_FR[ date.getDay() ];

const Calendar = () => {
	const { trainings, isLoadingTrainings } = useTrainingsStore();

	const upcomingTrainings = useMemo( () => {
		const result = [];
		const currentDate = new Date();

		for ( let i = 0; i <= 2; i++ ) {
			const nextDate = new Date();
			nextDate.setDate( currentDate.getDate() + i );

			const dayName = getDayInEnglish( nextDate );

			// Filtrer les trainings pour ce jour
			const dayTrainings = trainings.filter( ( training: Training ) =>
				training.days?.includes( dayName )
			);

			result.push( {
				date: nextDate,
				trainings: dayTrainings,
			} );
		}

		return result;
	}, [ trainings ] );

	return (
		<View className='px-5 bg-background flex-1'>
			<ScrollView>

				<CustomCalendar />

				<View className='mt-10'>
					{ isLoadingTrainings ? (
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
