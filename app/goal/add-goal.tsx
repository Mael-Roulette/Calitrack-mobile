import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { CreateGoalParams, Exercise, Goal } from "@/types";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, View, Text } from "react-native";
import ExerciseItem from "../exercise/components/ExerciseItem";
import ExerciseSelectionModal from "../exercise/components/ExerciseSelectionModal";

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
	const [ isModalVisible, setIsModalVisible ] = useState<boolean>( false );
	const [ selectedExercise, setSelectedExercise ] = useState<Exercise[]>( [] );
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const [ form, setForm ] = useState<FormState>( {
		total: "",
		progress: "",
	} );

	// Calcul des labels basé sur l'exercice sélectionné
	const labels = useMemo( () => {
		if ( !selectedExercise?.[ 0 ]?.format ) return LABEL_CONFIGS.default;
		return LABEL_CONFIGS[ selectedExercise[ 0 ].format ] || LABEL_CONFIGS.default;
	}, [ selectedExercise ] );

	const openExerciseModal = () => {
		setIsModalVisible( true );
	};

	const closeExerciseModal = () => {
		setIsModalVisible( false );
	};

	const handleExerciseSelection = ( exercises: Exercise[] ) => {
		setSelectedExercise( exercises );
		setIsModalVisible( false );
	};

	// Gestion des changements numériques
	const handleNumericChange = useCallback( ( field: keyof FormState, value: string ) => {
		if ( value === "" || /^\d+$/.test( value ) ) {
			setForm( prev => ( { ...prev, [ field ]: value } ) );
		}
	}, [] );

	// Validation et soumission du formulaire
	const submit = useCallback( async () => {
		if ( !selectedExercise || selectedExercise.length === 0 ) {
			Alert.alert( "Erreur", "Veuillez sélectionner un exercice" );
			return;
		}
		if ( !form.total ) {
			Alert.alert( "Erreur", "Veuillez renseigner l'objectif à atteindre" );
			return;
		}

		let exercise = selectedExercise[ 0 ];

		setIsSubmitting( true );
		try {
			const goalData: CreateGoalParams = {
				exercise: exercise.$id,
				total: parseInt( form.total, 10 ),
				progress: form.progress ? parseInt( form.progress, 10 ) : 0,
			};

			const response = await createGoal( goalData );

			if ( response.goal ) {
				const newGoal: Goal = {
					$id: response.goal.$id,
					$createdAt: response.goal.$createdAt,
					$updatedAt: response.goal.$updatedAt,
					exercise: exercise,
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

	return (
		<View className="bg-background min-h-full">
			<View className="flex-1 px-5">
				<View className="gap-5 mb-5">
					{/* Bouton de recherche d'exercice */ }
					<View>
						<View>
							<Text className="font-sregular text-lg text-primary mb-2">Sélectionne un mouvement</Text>
							<CustomButton
								title="Choisir maintenant"
								variant="secondary"
								onPress={ openExerciseModal }
							/>
						</View>

						{/* Affichage de l'exercice sélectionné */ }
						{ selectedExercise.length > 0 && (
							<View className='mt-4'>
								{ selectedExercise.map( ( exercise ) => (
									<ExerciseItem
										key={ exercise.$id }
										image={ exercise.image }
										name={ exercise.name }
										difficulty={ exercise.difficulty }
									/>
								) ) }
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

			<ExerciseSelectionModal
				isVisible={ isModalVisible }
				onClose={ closeExerciseModal }
				onExerciseSelected={ handleExerciseSelection }
				initialSelectedExercises={ selectedExercise }
				selectableExercise={ 1 }
			/>
		</View>
	);
};

export default AddGoal;