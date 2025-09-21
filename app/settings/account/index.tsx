import CustomInput from "@/components/CustomInput";
import { updatePassword, updateUser } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	Alert,
	Image,
	Text,
	TouchableOpacity,
	View,
} from "react-native";


const Index = () => {
	const { user, isLoading, refreshUser } = useAuthStore();
	const [ newAvatar, setNewAvatar ] = useState<string | undefined>( user?.avatar );
	const [ newPseudo, setNewPseudo ] = useState( user?.name || "" );
	const [ newMail, setNewMail ] = useState( user?.email || "" );

	const handleUpdateUser = async (
		newAvatar?: string,
		newPseudo?: string,
		newMail?: string
	) => {
		try {
			if ( !user ) return;
			await updateUser( {
				avatar: newAvatar || user.avatar,
				name: newPseudo || user.name,
				email: newMail || user.email,
			} );
			await refreshUser();

			router.push( "/profile" );
		} catch ( error ) {
			const errorMessage =
				error instanceof Error ? error.message : String( error );

			if ( errorMessage.toLowerCase().includes( "email" ) ) {
				Alert.alert(
					"Email déjà utilisé",
					"Cette adresse email est déjà utilisée. Veuillez en choisir une autre.",
					[ { text: "OK" } ]
				);
			} else {
				Alert.alert(
					"Erreur",
					"Une erreur est survenue lors de la mise à jour de votre profil.",
					[ { text: "OK" } ]
				);
			}
		}
	};

	const handleRecoverPassword = async () => {
		try {
			await updatePassword();

			Alert.alert(
				"Réinitialisation de mot de passe",
				"Un email de réinitialisation a été envoyé sur votre mail.",
				[ { text: "OK" } ]
			);
		} catch {
			Alert.alert(
				"Erreur",
				"Une erreur est survenue lors de l'envoi de l'email de réinitialisation.",
				[ { text: "OK" } ]
			);
		}
	};

	const pickNewAvatar = async () => {
		let result = await ImagePicker.launchImageLibraryAsync( {
			mediaTypes: [ "images" ],
			allowsEditing: true,
			aspect: [ 3, 3 ],
			quality: 1,
		} );

		if ( !result.canceled ) {
			const newAvatarUri = result.assets[ 0 ].uri;
			setNewAvatar( newAvatarUri );

			handleUpdateUser( newAvatarUri );
		}
	};

	return (
		<View className='flex-1 px-5 bg-background'>
			{ isLoading ? (
				<View className='flex-1 items-center justify-center'>
					<Text className='text-lg text-muted'>Chargement...</Text>
				</View>
			) : (
				<View className='gap-4 mb-8'>
					<View className='flex-row items-end justify-start gap-4 w-full'>
						<View className='w-24 h-24 rounded-full bg-gray-200 overflow-hidden'>
							{ user?.avatar ? (
								<Image
									source={ { uri: user.avatar } }
									className='w-full h-full'
									resizeMode='cover'
								/>
							) : (
								<View className='w-full h-full items-center justify-center'>
									<Ionicons name='person' size={ 50 } color='#132541' />
								</View>
							) }
						</View>
						<TouchableOpacity
							className='justify-center items-center bg-transparent rounded-md'
							accessibilityLabel='Modifier la photo de profil'
							onPress={ pickNewAvatar }
							disabled={ isLoading }
						>
							<Text className='text text-base underline'>
								Modifier la photo de profil
							</Text>
						</TouchableOpacity>
					</View>

					<View className='flex-row items-end justify-between gap-4 w-full'>
						<View className='flex-1'>
							<CustomInput
								label='Pseudo'
								value={ newPseudo }
								onChangeText={ ( text ) => setNewPseudo( text ) }
								placeholder='Entrer votre pseudo'
							/>
						</View>
						<TouchableOpacity
							className='self-end aspect-square h-[50px] justify-center items-center bg-secondary rounded-md'
							accessibilityLabel='Modifier le pseudo'
							onPress={ () => handleUpdateUser( undefined, newPseudo, undefined ) }
							disabled={ isLoading }
						>
							<Feather name='check' size={ 24 } color='#FFF9F7' />
						</TouchableOpacity>
					</View>

					<View className='flex-row items-end justify-between gap-4 w-full'>
						<View className='flex-1'>
							<CustomInput
								label='Email'
								value={ newMail }
								onChangeText={ ( text ) => setNewMail( text ) }
								placeholder='Entrer votre email'
							/>
						</View>
						<TouchableOpacity
							className='self-end aspect-square h-[50px] justify-center items-center bg-secondary rounded-md'
							accessibilityLabel='Modifier le mail'
							onPress={ () => handleUpdateUser( undefined, undefined, newMail ) }
							disabled={ isLoading }
						>
							<Feather name='check' size={ 24 } color='#FFF9F7' />
						</TouchableOpacity>
					</View>

					{/* <View className='gap-3'>
						<CustomInput
							label='Mot de passe'
							onChangeText={() => {}}
							placeholder='************'
							secureTextEntry={true}
							editable={false}
						/>

						<CustomButton
							title='Mail de réinitialisation'
							variant='secondary'
							onPress={() => handleRecoverPassword()}
						/>
					</View> */}
					<View className='mt-6'>
						<Text className='indicator-text'>
							Dans les prochaines versions, de nouvelles options seront ajoutées
							à cette page pour vous permettre de modifier votre mot de passe,
							personnaliser le thème de l&apos;application ou encore choisir la
							langue de votre interface.
						</Text>
					</View>
				</View>
			) }
		</View>
	);
};

export default Index;
