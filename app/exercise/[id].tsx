import { getExericseById } from "@/lib/exercise.appwrite";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Image } from 'expo-image';
import {
	ActivityIndicator,
	ScrollView,
	Text,
	View,
	TouchableOpacity
} from "react-native";
import { getExerciseImage } from '@/constants/exercises';
import { Ionicons } from "@expo/vector-icons";

const ExerciseDetails = () => {
	const { id } = useLocalSearchParams();
	const [ exercise, setExercise ] = useState<any>( null );
	const [ loading, setLoading ] = useState( true );
	const navigation = useNavigation();

	useEffect( () => {
		const fetchExercise = async () => {
			setLoading( true );
			try {
				const response = await getExericseById( id as string );
				setExercise( response );
			} catch ( error ) {
				console.error( "Erreur lors de la récupération de l'exercice", error );
				router.push( "/exercise/exercise-list" );
			} finally {
				setLoading( false );
			}
		};
		fetchExercise();
	}, [ id ] );

	/* ----- Masquer l'entete ----- */
	useLayoutEffect( () => {
		navigation.setOptions( {
			headerShown: false,
		} );
	}, [ navigation ] );

	return (
		<View className='flex-1 bg-background'>
			{ loading ? (
				<View className='flex-1 items-center justify-center'>
					<ActivityIndicator size='large' color='#0000ff' />
					<Text>Chargement...</Text>
				</View>
			) : (
				<ScrollView>
					<View className='relative bg-secondary px-4 py-8 rounded-b-2xl min-h-80 w-full items-center justify-center'>
						{ exercise.image ? (
							<Image
								source={ getExerciseImage( exercise.image ) }
								style={ { width: 250, height: 250 } }
								contentFit="contain"
							/>
						) : (
							<Text className="title-4 text-background text-center">Illustration en cours de création…</Text>
						) }

						<View className='absolute top-4 left-4 z-10'>
							<TouchableOpacity
								onPress={ () => router.back() }
								className='w-10 h-10 rounded-full items-center justify-center'
							>
								<Ionicons name="arrow-back" size={ 24 } color="#FFF9F7" />
							</TouchableOpacity>
						</View>
					</View>

					<View className='px-5 mt-6 mb-4'>
						<Text className="title-2 mb-4">{ exercise.name }</Text>
						<View className='flex-row items-center justify-between mb-3'>
							<Text className='text'>
								Type :{ " " }
								<Text className='text-secondary'>{ exercise.type.name }</Text>
							</Text>
							<Text className='text'>
								Difficulté :{ " " }
								<Text className='text-secondary'>{ exercise.difficulty }</Text>
							</Text>
						</View>
						<Text className='text mt-2'>{ exercise.description }</Text>
					</View>
				</ScrollView>
			) }
		</View>
	);
};

export default ExerciseDetails;
