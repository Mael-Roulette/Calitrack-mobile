import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import useExercicesStore from "@/store/exercises.stores";
import { Exercise } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	FlatList,
	Modal,
	PanResponder,
	Text,
	TouchableWithoutFeedback,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ExerciseSelectionModal = ( {
	isVisible,
	onClose,
	onExerciseSelected,
	initialSelectedExercises = [],
	selectableExercise,
}: {
	isVisible: boolean;
	onClose: () => void;
	onExerciseSelected?: ( exercises: Exercise[] ) => void;
	initialSelectedExercises?: Exercise[];
	selectableExercise?: number
} ) => {
	const { exercices } = useExercicesStore();

	const [ selectedExercises, setSelectedExercises ] = useState<Exercise[]>(
		initialSelectedExercises
	);
	const [ filteredExercises, setFilteredExercises ] =
		useState<Exercise[]>( exercices );

	useEffect( () => {
		setFilteredExercises( exercices );
	}, [ exercices ] );

	/* -------------------------------------------------- */
	/* ---------- Gestion de la modal ---------- */
	const panY = useRef( new Animated.Value( 0 ) ).current;
	const screenHeight = Dimensions.get( "screen" ).height;

	const resetPositionAnim = Animated.timing( panY, {
		toValue: 0,
		duration: 300,
		useNativeDriver: true,
	} );

	const closeAnim = Animated.timing( panY, {
		toValue: screenHeight,
		duration: 300,
		useNativeDriver: true,
	} );

	const panResponder = useRef(
		PanResponder.create( {
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: ( e, gestureState ) => {
				if ( gestureState.dy > 0 ) {
					panY.setValue( gestureState.dy );
				}
			},
			onPanResponderRelease: ( e, gestureState ) => {
				if ( gestureState.dy > 200 ) {
					closeModal();
				} else {
					resetPositionAnim.start();
				}
			},
		} )
	).current;

	useEffect( () => {
		if ( isVisible ) {
			panY.setValue( 0 );
			resetPositionAnim.start();
		}
	}, [ isVisible, initialSelectedExercises, panY, resetPositionAnim ] );

	const closeModal = useCallback( () => {
		closeAnim.start( () => {
			// setTimeout pour éviter les mises à jour synchrones
			setTimeout( () => {
				onClose();
			}, 0 );
		} );
	}, [ closeAnim, onClose ] );

	/* ----- Recherche d'exercice ----- */
	const handleSearch = ( text: string ) => {
		if ( !text.trim() ) {
			setFilteredExercises( exercices );
			return;
		}

		const query = text.toLowerCase();
		const filtered = exercices.filter(
			( exercise ) =>
				exercise.name?.toLowerCase().includes( query ) ||
				exercise.type?.toLowerCase().includes( query )
		);

		setFilteredExercises( filtered );
	};

	/* -------------------------------------------------- */
	/* ---------- Sélection des exercices ---------- */
	const handleExerciseToggle = useCallback( ( exercise: Exercise ) => {
		setSelectedExercises( ( prev ) => {
			const isAlreadySelected = prev.some( ( ex ) => ex.$id === exercise.$id );

			if ( isAlreadySelected ) {
				// Désélectionner l'exercice
				return prev.filter( ( ex ) => ex.$id !== exercise.$id );
			} else {
				// Si une limite est définie et atteinte, retirer le premier exercice
				if ( selectableExercise && prev.length >= selectableExercise ) {
					// Retirer le premier exercice et ajouter le nouveau
					return [ ...prev.slice( 1 ), exercise ];
				}
				// Sinon, ajouter simplement l'exercice
				return [ ...prev, exercise ];
			}
		} );

	}, [ selectableExercise ] );

	const isExerciseSelected = useCallback(
		( exercise: string ) => {
			return selectedExercises.some( ( ex ) => ex.$id === exercise );
		},
		[ selectedExercises ]
	)

	/* ----- Confirmer la sélection ----- */
	const handleConfirmSelection = useCallback( () => {
		setTimeout( () => {
			if ( onExerciseSelected ) {
				onExerciseSelected( selectedExercises );
			}
			closeModal();
		}, 0 );
	}, [ selectedExercises, onExerciseSelected, closeModal ] );

	if ( !isVisible ) return null;

	return (
		<Modal
			statusBarTranslucent={ true }
			animationType='slide'
			transparent={ true }
			visible={ isVisible }
			onRequestClose={ closeModal }
		>
			<TouchableWithoutFeedback onPress={ closeModal }>
				<SafeAreaView className='flex-1 bg-black/40 justify-end' edges={ [ 'bottom' ] }>
					<TouchableWithoutFeedback onPress={ ( e ) => e.stopPropagation() }>
						<Animated.View
							style={ {
								transform: [ { translateY: panY } ],
								shadowColor: "#000",
								shadowOffset: { width: 0, height: -10 },
								shadowOpacity: 0.25,
								shadowRadius: 10,
								elevation: 10,
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
							} }
							className='bg-background p-5 h-4/5 w-full'
						>
							<View
								{ ...panResponder.panHandlers }
								className='flex justify-center items-center mb-3 h-4 w-full'
							>
								<View className='h-1 w-16 bg-primary-100 rounded-full'></View>
							</View>

							<View className='flex-1'>
								<Text className='text-center text-primary font-calsans text-2xl'>
									Choisis tes exercices
								</Text>

								<Text className='text-center text-primary-100 font-sregular mb-4'>
									{ selectedExercises.length } exercice
									{ selectedExercises.length > 1 ? "s" : "" } sélectionné
									{ selectedExercises.length > 1 ? "s" : "" }
								</Text>

								<CustomInput
									label='Rechercher un exercice'
									placeholder='Ex : Front, planche, ...'
									onChangeText={ handleSearch }
									customStyles='mb-4'
								/>

								<FlatList
									className='flex-1 mb-4'
									data={ filteredExercises }
									showsVerticalScrollIndicator={ false }
									keyExtractor={ ( item ) => item.$id }
									renderItem={ ( { item } ) => (
										<ExerciseItem
											key={ item.$id }
											image={ item.image }
											name={ item.name }
											difficulty={ item.difficulty }
											selectable={ true }
											isSelected={ isExerciseSelected( item.$id ) }
											onPress={ () => handleExerciseToggle( item ) }
										/>
									) }
								/>

								<View className='flex-row gap-3'>
									<CustomButton
										title='Annuler'
										variant='secondary'
										onPress={ closeModal }
									/>
									<CustomButton
										title={ `Confirmer (${selectedExercises.length})` }
										onPress={ handleConfirmSelection }
									/>
								</View>
							</View>
						</Animated.View>
					</TouchableWithoutFeedback>
				</SafeAreaView>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default ExerciseSelectionModal;
