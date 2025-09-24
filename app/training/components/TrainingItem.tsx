import PrimaryGradient from "@/components/PrimaryGradient";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "@/components/CustomButton";
import { DAYS_TRANSLATION } from "@/constants/value";

const TrainingItem = ( {
	id,
	title,
	duration,
	days = [],
	isTrainingDay = false,
}: {
	id: string;
	title: string;
	duration: number;
	days?: string[];
	isTrainingDay?: boolean;
} ) => {
	const goToTraining = () => {
		if ( isTrainingDay ) {
			router.push( `/training/${id}/session` );
		} else {
			router.push( `/training/${id}/` );
		}
	};

	const formatDuration = ( duration: number ) => {
		return duration < 60
			? `${duration} minutes`
			: `${Math.floor( duration / 60 )}h${duration % 60 === 0 ? "" : duration % 60}`;
	};

	const TrainingContent = () => (
		<>
			<View className='flex-row justify-between items-center gap-12'>
				<Text
					className={ `font-sregular text-xl flex-1 ${isTrainingDay ? "text-background capitalize-first" : "text-primary"
						}` }
				>
					{ title }
				</Text>
				<View className='flex-row items-center gap-2'>
					<Ionicons
						name='time-sharp'
						size={ 24 }
						color={ isTrainingDay ? "#FFF9F7" : "#132541" }
					/>
					<Text
						className={ `font-sregular text-base ${isTrainingDay ? "text-background" : "text-primary"
							}` }
					>
						{ formatDuration( duration ) }
					</Text>
				</View>
			</View>
			{ days.length > 0 && (
				<ScrollView
					horizontal={ true }
					showsHorizontalScrollIndicator={ false }
					contentContainerStyle={ { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 1 } }
				>
					{ days.map( ( day, index ) => (
						<Text
							key={ index }
							className="py-1 px-3 bg-background rounded-full border border-secondary text-secondary font-sregular text-xs"
						>
							{ DAYS_TRANSLATION.find( ( d ) => d.value === day )?.label || day }
						</Text>
					) ) }
				</ScrollView>
			) }
			{ isTrainingDay ? (
				<TouchableOpacity
					className='flex-row items-center justify-center rounded-md py-3 px-6 gap-4 bg-background'
					onPress={ goToTraining }
				>
					<FontAwesome name="caret-right" size={ 22 } color="#FC7942" />
					<Text className='text-secondary font-sregular text-base'>
						Lancer ma séance
					</Text>
				</TouchableOpacity>
			) : (
				<CustomButton title="Voir l'entraînement" onPress={ goToTraining } />
			) }
		</>
	);

	if ( isTrainingDay ) {
		return (
			<PrimaryGradient style={ {} }>
				<View className='px-5 py-4 gap-3'>
					<TrainingContent />
				</View>
			</PrimaryGradient>
		);
	}

	return (
		<View className='w-full px-5 py-4 mb-5 gap-3 border-[1px] rounded-xl border-secondary'>
			<TrainingContent />
		</View>
	);
};

export default TrainingItem;
