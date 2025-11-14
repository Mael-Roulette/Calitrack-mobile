import CustomButton from "@/components/CustomButton";
import { MAX_TRAININGS } from "@/constants/value";
import { useTrainingsStore } from "@/store";
import { Training } from "@/types";
import { router } from "expo-router";
import {
	FlatList,
	Text,
	View
} from "react-native";
import TrainingItem from "../training/components/TrainingItem";


const Trainings = () => {
	const { trainings } = useTrainingsStore();

	const renderTrainingItem = ( { item }: { item: Training } ) => (
		<TrainingItem id={ item.$id } title={ item.name } duration={ item.duration } days={ item.days } />
	);

	return (
		<View className='px-5 bg-background flex-1'>
			<View className='mb-6'>
				<Text className='indicator-text'>
					Nombre d&apos;entraînements : { trainings.length }/{ MAX_TRAININGS }.
				</Text>
			</View>

			<View className='flex-1'>
				<FlatList
					data={ trainings }
					renderItem={ renderTrainingItem }
					keyExtractor={ ( item ) => item.$id || item.name }
					showsVerticalScrollIndicator={ false }
					ListEmptyComponent={
						<Text className='indicator-text'>
							Aucun entraînement
						</Text>
					}
				/>
			</View>

			<View className="mt-4 mb-5">
				<CustomButton
					title="Voir les exercices"
					variant="secondary"
					onPress={ () => router.push( "/exercise" ) }
				/>
			</View>
		</View>
	);
};

export default Trainings;
