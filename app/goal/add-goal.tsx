import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import useExercicesStore from "@/store/exercises.stores";
import { CreateGoalParams, Exercise, Goal } from "@/types";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import ExerciseItem from "../exercise/components/ExerciseItem";

interface FormState {
	total: string;
	progress: string;
}

interface LabelConfig {
	total: string;
	progress: string;
}

const LABEL_CONFIGS: Record<string, LabelConfig> = {
	hold: {
		total: "Temps de hold à atteindre",
		progress: "Temps de hold actuel",
	},
	repetition: {
		total: "Nombre de répétition à atteindre",
		progress: "Nombre de répétition actuel",
	},
	default: {
		total: "Max à atteindre",
		progress: "Max actuel",
	},
};

const AddGoal = () => {
	const { addGoalStore } = useGoalsStore();
	const { exercices } = useExercicesStore();
	const [ searchQuery, setSearchQuery ] = useState( "" );
	const [ selectedExercise, setSelectedExercise ] = useState<Exercise | null>( null );
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const [ form, setForm ] = useState<FormState>( {
		total: "",
		progress: "",
	} );

	// Calcul des labels basé sur l'exercice sélectionné
	const labels = useMemo( () => {
		if ( !selectedExercise?.format ) return LABEL_CONFIGS.default;
		return LABEL_CONFIGS[ selectedExercise.format ] || LABEL_CONFIGS.default;
	}, [ selectedExercise?.format ] );

	// Filtrage des exercices mémorisé
	const filteredExercises = useMemo( () => {
		if ( !searchQuery.trim() ) return [];

		const query = searchQuery.toLowerCase();
		return exercices.filter(
			( exercise ) =>
				exercise.name?.toLowerCase().includes( query ) ||
				exercise.type?.toLowerCase().includes( query )
		);
	}, [ searchQuery, exercices ] );

	// Affichage des suggestions uniquement si recherche active
	const showSuggestions = searchQuery.trim() !== "" && filteredExercises.length > 0;

	// Gestion de la recherche
	const handleSearch = useCallback( ( text: string ) => {
		setSearchQuery( text );
	}, [] );

	// Sélection d'un exercice
	const handleExerciseSelect = useCallback( ( exercise: Exercise ) => {
		setSelectedExercise( exercise );
		setSearchQuery( "" ); // Réinitialise la recherche
	}, [] );

	// Gestion des changements numériques
	const handleNumericChange = useCallback( ( field: keyof FormState, value: string ) => {
		if ( value === "" || /^\d+$/.test( value ) ) {
			setForm( prev => ( { ...prev, [ field ]: value } ) );
		}
	}, [] );

	// Validation et soumission du formulaire
	const submit = useCallback( async () => {
		if ( !selectedExercise ) {
			Alert.alert( "Erreur", "Veuillez sélectionner un exercice" );
			return;
		}
		if ( !form.total ) {
			Alert.alert( "Erreur", "Veuillez renseigner l'objectif à atteindre" );
			return;
		}

		setIsSubmitting( true );
		try {
			const goalData: CreateGoalParams = {
				exercise: selectedExercise.$id,
				total: parseInt( form.total, 10 ),
				progress: form.progress ? parseInt( form.progress, 10 ) : 0,
			};

			const response = await createGoal( goalData );

			if ( response.goal ) {
				const newGoal: Goal = {
					$id: response.goal.$id,
					$createdAt: response.goal.$createdAt,
					$updatedAt: response.goal.$updatedAt,
					exercise: selectedExercise,
					progress: response.goal.progress as number,
					total: response.goal.total as number,
					progressHistory: JSON.parse( response.goal.progressHistory as string || "[]" ),
					state: response.goal.state as Goal[ "state" ],
				};
				addGoalStore( newGoal );
			}

			router.push( "/goals" );
		} catch ( err ) {
			console.error( "Erreur lors de la création de l'objectif:", err );
			Alert.alert( "Erreur", "Échec de l'ajout. Veuillez réessayer." );
		} finally {
			setIsSubmitting( false );
		}
	}, [ selectedExercise, form, addGoalStore ] );

	// Render item optimisé pour FlatList
	const renderExerciseItem = useCallback( ( { item }: { item: Exercise } ) => (
		<TouchableOpacity
			className="py-3 px-4 border-b border-primary-100"
			onPress={ () => handleExerciseSelect( item ) }
			activeOpacity={ 0.7 }
		>
			<Text className="font-sregular text-primary">{ item.name }</Text>
		</TouchableOpacity>
	), [ handleExerciseSelect ] );

	// Key extractor optimisé
	const keyExtractor = useCallback( ( item: Exercise ) => item.$id || item.name, [] );

	return (
		<View className="bg-background min-h-full">
			<View className="flex-1 px-5">
				<View className="gap-5 mb-5">
					{/* Recherche d'exercice */ }
					<View>
						<CustomInput
							label="Rechercher un exercice"
							placeholder="Ex : Front, planche, ..."
							value={ searchQuery }
							onChangeText={ handleSearch }
							customStyles="mb-2"
						/>

						{/* Liste de suggestions */ }
						{ showSuggestions && (
							<View className="bg-background border border-primary-100 rounded-md mb-4 max-h-48">
								<FlatList
									data={ filteredExercises }
									keyExtractor={ keyExtractor }
									renderItem={ renderExerciseItem }
									nestedScrollEnabled
									initialNumToRender={ 10 }
									maxToRenderPerBatch={ 10 }
									windowSize={ 5 }
								/>
							</View>
						) }

						{/* Affichage de l'exercice sélectionné */ }
						{ selectedExercise && (
							<View>
								<Text className="text-primary font-sregular mb-2">
									Exercice sélectionné :
								</Text>
								<ExerciseItem
									name={ selectedExercise.name }
									type={ selectedExercise.type }
									difficulty={ selectedExercise.difficulty }
								/>
							</View>
						) }
					</View>

					{/* Champs de formulaire */ }
					<CustomInput
						label={ labels.total }
						value={ form.total }
						placeholder="10"
						keyboardType="numeric"
						onChangeText={ ( value ) => handleNumericChange( "total", value ) }
					/>
					<CustomInput
						label={ labels.progress }
						value={ form.progress }
						placeholder="2"
						keyboardType="numeric"
						onChangeText={ ( value ) => handleNumericChange( "progress", value ) }
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