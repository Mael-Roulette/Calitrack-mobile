import { useTrainingsStore } from "@/store";
import { Training } from "@/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, router } from "expo-router";
import {
	Alert,
	FlatList,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import TrainingItem from "../training/components/TrainingItem";
import { useLayoutEffect } from "react";
import { MAX_TRAININGS } from "@/constants/value";
import CustomButton from "@/components/CustomButton";


const Trainings = () => {
	const { trainings } = useTrainingsStore();
	const navigation = useNavigation();

	const renderTrainingItem = ( { item }: { item: Training } ) => (
		<TrainingItem id={ item.$id } title={ item.name } duration={ item.duration } days={ item.days } />
	);

	const handleAddTrainingLink = () => {
		if ( trainings.length >= MAX_TRAININGS ) {
			Alert.alert(
				"Limite atteinte",
				`Vous ne pouvez pas ajouter plus de ${MAX_TRAININGS} entraînements.`
			);
		} else {
			router.push( "/training/add-training" );
		}
	};

	useLayoutEffect( () => {
		navigation.setOptions( {
			headerRight: () => (
				<TouchableOpacity onPress={ handleAddTrainingLink } className="mr-4" accessibilityLabel="Ajouter un entraînement">
					<Ionicons name='add-circle-outline' size={ 30 } color='#132541' />
				</TouchableOpacity>
			),
		} );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ navigation, trainings.length ] );

	return (
		<View className='px-5 bg-background flex-1 pt-5'>
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
					onPress={ () => router.push( "/exercise/exercise-list" ) }
				/>
			</View>
		</View>
	);
};

export default Trainings;
