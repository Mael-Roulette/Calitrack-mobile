import ExerciseItem from "@/app/exercise/components/ExerciseItem";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import useExercicesStore from "@/store/exercises.stores";
import { Exercise } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
	Animated,
	Dimensions,
	Modal,
	PanResponder,
	ScrollView,
	Text,
	TouchableWithoutFeedback,
	View,
	FlatList,
} from "react-native";

const ExerciseSelectionModal = ({
	isVisible,
	onClose,
	onExerciseSelected,
	initialSelectedExercises = [],
}: {
	isVisible: boolean;
	onClose: () => void;
	onExerciseSelected?: (exercises: Exercise[]) => void;
	initialSelectedExercises?: Exercise[];
}) => {
	const { exercices } = useExercicesStore();

	const [selectedExercises, setSelectedExercises] = useState<Exercise[]>(
		initialSelectedExercises
	);
	const [filteredExercises, setFilteredExercises] =
		useState<Exercise[]>(exercices);

	useEffect(() => {
		setFilteredExercises(exercices);
	}, [exercices]);

	/* -------------------------------------------------- */
	/* ---------- Gestion de la modal ---------- */
	const panY = useRef(new Animated.Value(0)).current;
	const screenHeight = Dimensions.get("screen").height;

	const resetPositionAnim = Animated.timing(panY, {
		toValue: 0,
		duration: 300,
		useNativeDriver: true,
	});

	const closeAnim = Animated.timing(panY, {
		toValue: screenHeight,
		duration: 300,
		useNativeDriver: true,
	});

	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: () => true,
			onPanResponderMove: (e, gestureState) => {
				if (gestureState.dy > 0) {
					panY.setValue(gestureState.dy);
				}
			},
			onPanResponderRelease: (e, gestureState) => {
				if (gestureState.dy > 200) {
					closeModal();
				} else {
					resetPositionAnim.start();
				}
			},
		})
	).current;

	useEffect(() => {
		if (isVisible) {
			panY.setValue(0);
			resetPositionAnim.start();
			setSelectedExercises(initialSelectedExercises);
		}
	}, [isVisible, initialSelectedExercises]);

	const closeModal = useCallback(() => {
		closeAnim.start(() => {
			// Utiliser setTimeout pour éviter les mises à jour synchrones
			setTimeout(() => {
				onClose();
			}, 0);
		});
	}, [closeAnim, onClose]);

	/* ----- Recherche d'exercice ----- */
	const handleSearch = (text: string) => {
		if (!text.trim()) {
			setFilteredExercises(exercices);
			return;
		}

		const query = text.toLowerCase();
		const filtered = exercices.filter(
			(exercise) =>
				exercise.name?.toLowerCase().includes(query) ||
				exercise.type?.name?.toLowerCase().includes(query)
		);

		setFilteredExercises(filtered);
	};

	/* -------------------------------------------------- */
	/* ---------- Sélection des exercices ---------- */
	const handleExerciseToggle = useCallback((exercise: Exercise) => {
		setSelectedExercises((prev) => {
			const isAlreadySelected = prev.some((ex) => ex.$id === exercise.$id);

			if (isAlreadySelected) {
				// Désélectionner l'exercice
				return prev.filter((ex) => ex.$id !== exercise.$id);
			} else {
				// Sélectionner l'exercice
				return [...prev, exercise];
			}
		});
	}, []);

	const isExerciseSelected = useCallback(
		(exerciseId: string) => {
			return selectedExercises.some((ex) => ex.$id === exerciseId);
		},
		[selectedExercises]
	);

	/* ----- Confirmer la sélection ----- */
	const handleConfirmSelection = useCallback(() => {
		setTimeout(() => {
			console.log( selectedExercises );
			if (onExerciseSelected) {
				onExerciseSelected(selectedExercises);
			}
			closeModal();
		}, 0);
	}, [selectedExercises, onExerciseSelected, closeModal]);

	if (!isVisible) return null;

	return (
		<Modal
			animationType='slide'
			transparent={true}
			visible={isVisible}
			onRequestClose={closeModal}
		>
			<TouchableWithoutFeedback onPress={closeModal}>
				<View className='flex-1 bg-black/40 justify-end'>
					<TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
						<Animated.View
							style={{
								transform: [{ translateY: panY }],
								shadowColor: "#000",
								shadowOffset: { width: 0, height: -10 },
								shadowOpacity: 0.25,
								shadowRadius: 10,
								elevation: 10,
								borderTopLeftRadius: 20,
								borderTopRightRadius: 20,
							}}
							className='bg-background p-5 h-4/5 w-full'
						>
							<View
								{...panResponder.panHandlers}
								className='flex justify-center items-center mb-3 h-4 w-full'
							>
								<View className='h-1 w-16 bg-primary-100 rounded-full'></View>
							</View>

							<View className='flex-1'>
								<Text className='text-center text-primary font-calsans text-2xl'>
									Choisis tes exercices
								</Text>

								<Text className='text-center text-primary-100 font-sregular mb-4'>
									{selectedExercises.length} exercice
									{selectedExercises.length > 1 ? "s" : ""} sélectionné
									{selectedExercises.length > 1 ? "s" : ""}
								</Text>

								<CustomInput
									label='Rechercher un exercice'
									placeholder='Ex : Front, planche, ...'
									onChangeText={handleSearch}
									customStyles='mb-4'
								/>

								<FlatList
									className='flex-1 mb-4'
									data={filteredExercises}
									showsVerticalScrollIndicator={false}
									keyExtractor={(item) => item.$id}
									renderItem={({ item }) => (
										<ExerciseItem
											key={item.$id}
											name={item.name}
											type={item.type.name}
											difficulty={item.difficulty}
											selectable={true}
											isSelected={isExerciseSelected(item.$id)}
											onPress={() => handleExerciseToggle(item)}
										/>
									)}
								/>

								<View className='flex-row gap-3'>
									<CustomButton
										title='Annuler'
										variant='secondary'
										onPress={closeModal}
									/>
									<CustomButton
										title={`Confirmer (${selectedExercises.length})`}
										onPress={handleConfirmSelection}
									/>
								</View>
							</View>
						</Animated.View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default ExerciseSelectionModal;
