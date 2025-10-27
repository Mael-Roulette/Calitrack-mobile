import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { CreateGoalParams } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

interface FormState {
	title: string;
	total: string;
	progress: string;
}

const AddGoal = () => {
	const [ isSubmitting, setIsSubmitting ] = useState( false );
	const [ form, setForm ] = useState<FormState>( {
		title: "",
		total: "",
		progress: "",
	} );

	const { fetchUserGoals } = useGoalsStore();

	const submit = async () => {
		if ( !form.title || !form.total ) {
			Alert.alert( "Erreur", "Veuillez remplir tous les champs" );
			return;
		}

		try {
			setIsSubmitting( true );

			const goalData: CreateGoalParams = {
				title: form.title,
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

	const handleNumericChange = ( field: 'total' | 'progress', value: string ) => {
		// Permet uniquement les chiffres ou une chaîne vide
		if ( value === "" || /^\d+$/.test( value ) ) {
			setForm( prev => ( { ...prev, [ field ]: value } ) );
		}
	};

	return (
		<View className="bg-background min-h-full">
			<ScrollView className="px-5">
				<View className="gap-5 h-full">
					<CustomInput
						label="Nom de l'objectif"
						value={ form.title }
						placeholder="10s straddle planche"
						onChangeText={ ( text ) =>
							setForm( prev => ( { ...prev, title: text } ) )
						}
					/>
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
			</ScrollView>
		</View>
	);
};

export default AddGoal;