import { DAYS_TRANSLATION } from "@/constants/value";
import { deleteTraining, getTrainingById } from "@/lib/training.appwrite";
import { useTrainingsStore } from "@/store";
import { SeriesParams } from "@/types/series";
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
import SeriesItem from "../components/SeriesItem";
import { Training } from "@/types";
import Entypo from '@expo/vector-icons/Entypo';


const Index = () => {
	const { id } = useLocalSearchParams();
	const [ training, setTraining ] = useState<any>( null );
	const [ loading, setLoading ] = useState( true );
	const [ trainingSeries, setTrainingSeries ] = useState<SeriesParams[]>( [] );
	const [ showMenu, setShowMenu ] = useState( false );
	const navigation = useNavigation();
	const { deleteTrainingStore, getById, addTrainingStore } = useTrainingsStore();

	// Chargement de l'entrainement
	useEffect( () => {
		const load = async () => {
			const cached = getById( id as string );

			if ( cached ) {
				setTraining( cached );
				setLoading( false );
				return;
			}

			// Fallback API si pas encore chargé
			try {
				setLoading( true );
				const training = await getTrainingById( id as string ) as any as Training;
				setTraining( training );

				// mise dans le store
				addTrainingStore( training );

			} catch {
				router.push( "/trainings" );
			} finally {
				setLoading( false );
			}
		};

		load();
	}, [ addTrainingStore, getById, id ] );

	// Triage des série dans l'ordre
	useEffect( () => {
		if ( training && training.series ) {
			setTrainingSeries(
				training.series.sort(
					( a: SeriesParams, b: SeriesParams ) => a.order - b.order
				)
			);
		}
	}, [ training ] );

	// Gère le lancement du séance
	const handleStart = () => {
		setShowMenu( false )
		router.push( `/training/${id}/session` );
	};

	// Gère l'édition de l'entrainement
	const handleEdit = () => {
		setShowMenu( false );
		router.push( `/training/${id}/edit` );
	};

	// Gère la supression de l'entrainement
	const handleDelete = () => {
		setShowMenu( false );
		deleteTraining( training.$id )
			.then( () => deleteTrainingStore( training.$id ) )
			.then( () => router.push( "/(tabs)/trainings" ) );
	};


	// Header
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
								<View className='absolute top-16 right-14 bg-background rounded-md shadow-lg elevation-md min-w-40'>
									<TouchableOpacity
										onPress={ handleStart }
										className='flex-row items-center px-4 py-3 border-b border-gray-200'
									>
										<Entypo name="controller-play" size={ 18 } color="#132541" />
										<Text className='ml-3 text-base font-sregular text-primary'>
											Lancer la séance
										</Text>
									</TouchableOpacity>

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


	// Temps de l'entrainement formaté
	const durationSeconds = training?.duration ?? 0;
	const hours = Math.floor( durationSeconds / 3600 );
	const minutes = Math.floor( ( durationSeconds % 3600 ) / 60 );

	const formattedDuration = hours > 0
		? `${hours}h${minutes > 0 ? minutes : ""}`
		: `${minutes} min`;


	// Render item pour une série
	const renderSeriesItem = ( { item }: { item: SeriesParams } ) => (
		<SeriesItem
			seriesData={ item }
		/>
	);

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
						Durée: { formattedDuration }
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
						data={ trainingSeries }
						renderItem={ renderSeriesItem }
						keyExtractor={ ( item ) => item.$id }
						showsVerticalScrollIndicator={ true }
						scrollEnabled={ false }
						ListEmptyComponent={
							<Text className='indicator-text'>Aucune série</Text>
						}
					/>
				</View>
			) }
		</ScrollView>
	);
};

export default Index;
