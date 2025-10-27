import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { createGoalParams } from "@/types";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

const AddGoal = () => {
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );

	const [ form, setForm ] = useState<createGoalParams>( {
		title: "",
		total: 0,
		progress: 0,
	} );
	const { fetchUserGoals } = useGoalsStore();

	const submit = async (): Promise<void> => {
		if ( !form.title || !form.total ) {
			Alert.alert( "Erreur", "Veuillez remplir tous les champs" );
			return;
		}

		const { title, total, progress } = form;


		try {
			setIsSubmitting( true );
			await createGoal( {
				title,
				progress: progress || 0,
				total,
			} );

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
		<View className='bg-background min-h-full'>
			<ScrollView className='px-5'>
				<View className='gap-5 h-full'>
					<CustomInput
						label="Nom de l'objectif"
						value={ form.title }
						placeholder='10s straddle planche'
						onChangeText={ ( text ) =>
							setForm( ( prev ) => ( { ...prev, title: text } ) )
						}
					/>

					<CustomInput
						label='Max à atteindre'
						value={ form.total.toString() }
						placeholder='10'
						keyboardType='numeric'
						onChangeText={ ( number ) =>
							setForm( ( prev ) => ( { ...prev, total: parseInt( number ) } ) )
						}
					/>
					<CustomInput
						label='Max actuel'
						value={ form.progress as any as string }
						placeholder='2'
						keyboardType='numeric'
						onChangeText={ ( number ) =>
							setForm( ( prev ) => ( {
								...prev,
								progress: number ? parseInt( number ) : 0,
							} ) )
						}
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