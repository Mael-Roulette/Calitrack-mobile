import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { createGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { GoalState } from "@/types";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";

// TODO : Modifier couleur choix du type
const AddGoal = () => {
	const [ isSubmitting, setIsSubmitting ] = useState<boolean>( false );

	const [ form, setForm ] = useState<GoalState>( {
		title: "",
		type: "push",
		total: "",
		progress: 0,
	} );
	const { fetchUserGoals } = useGoalsStore();

	const submit = async (): Promise<void> => {
		if ( !form.title || !form.type || !form.total ) {
			Alert.alert( "Erreur", "Veuillez remplir tous les champs" );
			return;
		}

		const { title, type, total, progress } = form;


		try {
			setIsSubmitting( true );
			await createGoal( {
				title: title,
				type: type,
				progress: progress || 0,
				total: parseInt( total ),
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
					<View>
						<Text className='font-sregular text-xl mb-2'>
							Type d&apos;objectif
						</Text>
						<View
							style={ {
								borderWidth: 1,
								borderColor: "#617188",
								borderRadius: 8,
								overflow: "hidden",
							} }
						>
							<Picker
								selectedValue={ form.type }
								onValueChange={ ( itemValue ) =>
									setForm( ( prev ) => ( {
										...prev,
										type: itemValue as "push" | "pull",
									} ) )
								}
								style={ { backgroundColor: "#FFF9F7", paddingLeft: 16 } }
							>
								<Picker.Item label='Push' value='push' />
								<Picker.Item label='Pull' value='pull' />
							</Picker>
						</View>
					</View>
					<CustomInput
						label='Max à atteindre'
						value={ form.total }
						placeholder='10'
						keyboardType='numeric'
						onChangeText={ ( number ) =>
							setForm( ( prev ) => ( { ...prev, total: number } ) )
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
