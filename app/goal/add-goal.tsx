import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import useExercicesStore from "@/store/exercises.stores";
import { CreateGoalParams, Exercise } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import ExerciseItem from "../exercise/components/ExerciseItem";

interface FormState {
	total: string;
	progress: string;
}

const AddGoal = () => {
	const { fetchUserGoals } = useGoalsStore();
	const { exercices } = useExercicesStore();
	const [ filteredExercises, setFilteredExercises ] = useState<Exercise[]>( [] );
	const [ selectedExercise, setSelectedExercise ] = useState<Exercise | null>( null );
	const [ showSuggestions, setShowSuggestions ] = useState( false );
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const [ form, setForm ] = useState<FormState>( {
		total: "",
		progress: "",
	} );

	/* ----- Recherche d'exercice ----- */
	const handleSearch = ( text: string ) => {
		if ( !text.trim() ) {
			setFilteredExercises( [] );
			setShowSuggestions( false );
			return;
		}
		const query = text.toLowerCase();
		const filtered = exercices.filter(
			( exercise ) =>
				exercise.name?.toLowerCase().includes( query ) ||
				exercise.type?.toLowerCase().includes( query )
		);
		setFilteredExercises( filtered );
		setShowSuggestions( true );
	};

	const handleExerciseSelect = ( exercise: Exercise ) => {
		setSelectedExercise( exercise );
		setShowSuggestions( false );
		setFilteredExercises( [] );
	};

	const handleNumericChange = ( field: 'total' | 'progress', value: string ) => {
		// Permet uniquement les chiffres ou une chaîne vide
		if ( value === "" || /^\d+$/.test( value ) ) {
			setForm( prev => ( { ...prev, [ field ]: value } ) );
		}
	};

	// envoie du formulaire d'ajout d'un objectif
	const submit = async () => {
		if ( !selectedExercise || !form.total ) {
			Alert.alert( "Erreur", "Veuillez remplir tous les champs" );
			return;
		}
		try {
			setIsSubmitting( true );
			const goalData: CreateGoalParams = {
				exercise: selectedExercise.$id,
				total: parseInt( form.total, 10 ),
				progress: form.progress ? parseInt( form.progress, 10 ) : 0,
			};
			await createGoal( goalData );
			await fetchUserGoals();
			router.push( "/goals" );
		} catch ( err ) {
			console.error( err );
			Alert.alert( "Erreur", "Échec de l'ajout. Veuillez réessayer." );
		} finally {
			setIsSubmitting( false );
		}
	};

	return (
		<View className="bg-background min-h-full">
			<View className="flex-1 px-5">
				<View className="gap-5 mb-5">
					<View>
						<CustomInput
							label='Rechercher un exercice'
							placeholder='Ex : Front, planche, ...'
							onChangeText={ handleSearch }
							customStyles='mb-2'
						/>

						{/* Liste de suggestions */ }
						{ showSuggestions && filteredExercises.length > 0 && (
							<View className="bg-background border border-primary-100 rounded-md mb-4 max-h-48">
								<FlatList
									data={ filteredExercises }
									keyExtractor={ ( item ) => item.$id || item.name }
									nestedScrollEnabled
									renderItem={ ( { item } ) => (
										<TouchableOpacity
											className="py-3 px-4 border-b border-primary-100 "
											onPress={ () => handleExerciseSelect( item ) }
										>
											<Text className="font-sregular text-primary">{ item.name }</Text>
										</TouchableOpacity>
									) }
								/>
							</View>
						) }

						{/* Affichage de l'exercice sélectionné */ }
						{ selectedExercise && (
							<View>
								<Text className="text-primary font-sregular mb-2">Exercice sélectionné :</Text>
								<ExerciseItem
									name={ selectedExercise.name }
									type={ selectedExercise.type }
									difficulty={ selectedExercise.difficulty }
								/>
							</View>
						) }
					</View>

					<CustomInput
						label="Max à atteindre"
						value={ form.total }
						placeholder="10"
						keyboardType="numeric"
						onChangeText={ ( value ) => handleNumericChange( 'total', value ) }
					/>
					<CustomInput
						label="Max actuel"
						value={ form.progress }
						placeholder="2"
						keyboardType="numeric"
						onChangeText={ ( value ) => handleNumericChange( 'progress', value ) }
					/>
				</View>
				<CustomButton
					title="Ajouter l'objectif"
					onPress={ submit }
					isLoading={ isSubmitting }
				/>
			</View>
		</View>
	);
};

export default AddGoal;