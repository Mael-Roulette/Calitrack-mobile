import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import { DAYS_TRANSLATION } from "@/constants/value";
import { deleteTraining, getTrainingById } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import { Exercise } from "@/types";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Modal,
	ScrollView,
	Text,
	TouchableOpacity,
	View
} from "react-native";


const Index = () => {
	const { id } = useLocalSearchParams();
	const [ training, setTraining ] = useState<any>( null );
	const [ loading, setLoading ] = useState( true );
	const [ trainingExercises, setTrainingExercises ] = useState<Exercise[]>( [] );
	const [ showMenu, setShowMenu ] = useState( false );
	const navigation = useNavigation();
	const { fetchUserTrainings } = useTrainingsStore();

	useEffect( () => {
		const fetchTraining = async () => {
			setLoading( true );
			try {
				const response = await getTrainingById( id as string );
				setTraining( response );
			} catch ( error ) {
				console.error(
					"Erreur lors de la récupération de l'entraînement",
					error
				);
				router.push( "/trainings" );
			} finally {
				setLoading( false );
			}
		};
		fetchTraining();
	}, [ id ] );

	const handleDelete = () => {
		setShowMenu( false );
		deleteTraining( training.$id )
			.then( () => fetchUserTrainings() )
			.then( () => router.push( "/trainings" ) );
	};

	const handleEdit = () => {
		setShowMenu( false );
		router.push( `/training/${id}/edit` );
	};

	useLayoutEffect( () => {
		navigation.setOptions( {
			headerTitle: () => (
				<Text
					className='title-2 text-ellipsis overflow-hidden max-w-60'
					numberOfLines={ 1 }
				>
					{ training?.name || "Entraînement" }
				</Text>
			),
			headerRight: () => (
				<View className='relative'>
					<TouchableOpacity
						onPress={ () => setShowMenu( !showMenu ) }
						accessibilityLabel='Voir les options'
					>
						<Feather name='more-vertical' size={ 30 } color='#132541' />
					</TouchableOpacity>

					{ showMenu && (
						<Modal
							transparent={ true }
							visible={ showMenu }
							animationType='fade'
							onRequestClose={ () => setShowMenu( false ) }
						>
							<TouchableOpacity
								style={ { flex: 1 } }
								activeOpacity={ 1 }
								onPress={ () => setShowMenu( false ) }
							>
								<View className='absolute top-16 right-5 bg-background rounded-md shadow-lg elevation-md min-w-40'>
									<TouchableOpacity
										onPress={ handleEdit }
										className='flex-row items-center px-4 py-3 border-b border-gray-200'
									>
										<Feather name='edit' size={ 18 } color='#132541' />
										<Text className='ml-3 text-base font-sregular text-primary'>
											Modifier
										</Text>
									</TouchableOpacity>

									<TouchableOpacity
										onPress={ handleDelete }
										className='flex-row items-center px-4 py-3'
									>
										<Feather name='trash-2' size={ 18 } color='#ef4444' />
										<Text className='ml-3 text-base text-red-500 font-sregular'>
											Supprimer
										</Text>
									</TouchableOpacity>
								</View>
							</TouchableOpacity>
						</Modal>
					) }
				</View>
			),
		} );
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ navigation, training, id, router, showMenu ] );

	useEffect( () => {
		if ( training && training.exercise ) {
			setTrainingExercises( training.exercise );
		}
	}, [ training ] );

	const renderExerciseItem = ( { item }: { item: Exercise } ) => (
		<ExerciseItem
			name={ item.name }
			type={ item.type }
			difficulty={ item.difficulty }
			onPress={ () => goToExerciseDetails( item.$id ) }
		/>
	);

	const goToExerciseDetails = ( id: string ) => {
		router.push( {
			pathname: "/exercise/[id]",
			params: { id },
		} );
	};

	return (
		<ScrollView className='bg-background min-h-full' contentContainerStyle={ { paddingBottom: 20 } }>
			{ loading ? (
				<View className='flex-1 justify-center items-center'>
					<ActivityIndicator size='large' color='#FC7942' />
					<Text className='mt-2 text-primary'>Chargement...</Text>
				</View>
			) : (
				<View className="px-5">
					<Text className='text-lg font-sregular text-primary mb-2'>
						Durée:{ " " }
						{ training?.duration < 60
							? `${training?.duration} minutes`
							: `${Math.floor( ( training?.duration ?? 0 ) / 60 )}h${( training?.duration ?? 0 ) % 60 === 0 ? "" : ( training?.duration ?? 0 ) % 60}` }
					</Text>
					{ training.days.length > 0 && (
						<ScrollView
							horizontal={ true }
							showsHorizontalScrollIndicator={ false }
							contentContainerStyle={ { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 1, marginBottom: 16 } }
						>
							{ training.days.map( ( day: string, index: number ) => (
								<Text
									key={ index }
									className="py-1 px-3 bg-background rounded-full border border-secondary text-secondary font-sregular text-xs"
								>
									{ DAYS_TRANSLATION.find( ( d ) => d.value === day )?.label || day }
								</Text>
							) ) }
						</ScrollView>
					) }
					<FlatList
						data={ trainingExercises }
						renderItem={ renderExerciseItem }
						keyExtractor={ ( item ) => item.name }
						showsVerticalScrollIndicator={ true }
						scrollEnabled={ false }
						ListEmptyComponent={
							<Text className='indicator-text'>Aucun exercice</Text>
						}
					/>
				</View>
			) }
		</ScrollView>
	);
};

export default Index;
