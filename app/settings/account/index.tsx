import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { deleteAccount, updateUser } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
	Alert,
	Image,
	Modal,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";


const Index = () => {
	const { user, isLoading, refreshUser, setIsAuthenticated, setUser } = useAuthStore();
	const [ newPseudo, setNewPseudo ] = useState( user?.name || "" );
	const [ newMail, setNewMail ] = useState( user?.email || "" );
	const [ password, setPassword ] = useState( user?.email || "" );
	const [ , setDeleteLoading ] = useState( false );
	const [ showModal, setShowModal ] = useState( false );

	/**
	 * Mise à jour du pseudo de l'utilisateur
	 * @param pseudo nouveau pseudo de l'utilisateur
	 */
	const handleUpdatePseudo = async ( pseudo: string ) => {
		try {
			if ( !user ) return;

			await updateUser( { name: pseudo } );
			await refreshUser();

			router.push( "/profile" );
		} catch {
			Alert.alert(
				"Erreur",
				"Une erreur est survenue lors de la mise à jour de votre profil.",
				[ { text: "OK" } ]
			);
		}
	}

	const handleUpdateEmail = async ( email: string, password: string ) => {
		try {
			if ( !user ) return;

			await updateUser( { email }, password );
			await refreshUser();

			router.push( "/profile" );
		} catch {
			Alert.alert(
				"Erreur",
				"Une erreur est survenue lors de la mise à jour de votre profil.",
				[ { text: "OK" } ]
			);
		}
	}

	/**
	 * Permet de choisir une nouvelle photo de profil
	 */
	const pickNewAvatar = async () => {
		let result = await ImagePicker.launchImageLibraryAsync( {
			mediaTypes: [ "images" ],
			allowsEditing: true,
			aspect: [ 3, 3 ],
			quality: 1,
		} );

		if ( !result.canceled ) {
			const newAvatarUri = result.assets[ 0 ].uri;

			await updateUser( { avatar: newAvatarUri } );
			await refreshUser();

			router.push( "/profile" );
		}
	};

	/**
	 * Gérer la suppression du compte utilisateur
	 */
	const handleDeleteAccount = async () => {
		Alert.alert(
			"Supprimer votre compte",
			"Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?",
			[
				{ text: "Annuler", style: "cancel" },
				{
					text: "Supprimer",
					style: "destructive",
					onPress: async () => {
						setDeleteLoading( true );
						try {
							await deleteAccount();

							setIsAuthenticated( false );
							setUser( null );

							router.replace( "/(auth)" );

							Alert.alert(
								"Compte supprimé",
								"Votre compte a été supprimé avec succès."
							);
						} catch ( error ) {
							const errorMessage =
								error instanceof Error ? error.message : String( error );
							Alert.alert(
								"Erreur",
								"Une erreur est survenue lors de la suppression de votre compte."
							);
							console.error( "Delete account error:", errorMessage );
						} finally {
							setDeleteLoading( false );
						}
					},
				},
			]
		);
	};

	if ( isLoading ) {
		return (
			<View className='bg-background flex-1 justify-center items-center'>
				<Text className='text-primary text-lg'>Suppression en cours...</Text>
			</View>
		)
	}

	return (
		<View className='bg-background min-h-full'>
			{ isLoading ? (
				<View className='flex-1 items-center justify-center'>
					<Text className='text-lg text-muted'>Chargement...</Text>
				</View>
			) : (
				<ScrollView className="px-5">
					<View className='gap-8'>
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

						<View className='flex-col gap-4'>
							<View className='flex-1'>
								<CustomInput
									label='Pseudo'
									value={ newPseudo }
									onChangeText={ ( text ) => setNewPseudo( text ) }
									placeholder='Entrer votre pseudo'
								/>
							</View>
							<CustomButton
								title="Modifier votre pseudo"
								onPress={ () => handleUpdatePseudo( newPseudo ) }
								variant="secondary"
							/>
						</View>

						<View className='flex-col gap-4'>
							<View className='flex-1'>
								<CustomInput
									label='Email'
									placeholder={ user?.email }
									editable={ false }
								/>
							</View>
							<CustomButton
								title="Modifier votre email"
								onPress={ () => setShowModal( !showModal ) }
								variant="secondary"
							/>
						</View>
					</View>

					<View className="mt-8">
						<Text className='indicator-text mb-4'>
							La suppression de votre compte est irréversible et entraînera la
							perte de toutes vos données.
						</Text>
						<TouchableOpacity
							onPress={ handleDeleteAccount }
							className='flex-row items-center py-3'
						>
							<Ionicons name='log-out-outline' size={ 24 } color='#F43F5E' />
							<Text className='ml-3 text-lg text-rose-500 font-medium'>
								Supprimer mon compte
							</Text>
						</TouchableOpacity>
					</View>

					{ showModal && (
						<Modal
							transparent={ true }
							visible={ showModal }
							animationType='fade'
							onRequestClose={ () => setShowModal( false ) }
						>
							<TouchableOpacity
								style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }
								activeOpacity={ 1 }
								onPress={ () => setShowModal( false ) }
							>
								<View className="w-5/6 h-fit flex-col justify-center items-center gap-4 py-4 px-4 bg-background rounded-md">
									<CustomInput
										placeholder={ user?.email }
										label="Renseignez votre nouvel email"
										onChangeText={ ( text ) => setNewMail( text ) }
									/>

									<CustomInput
										placeholder="Mot de passe actuel"
										label="Renseignez votre mot de passe"
										secureTextEntry={ true }
										onChangeText={ ( text ) => setPassword( text ) }
									/>

									<CustomButton
										title="Confirmer"
										onPress={ () => handleUpdateEmail( newMail, password ) }
									/>
								</View>
							</TouchableOpacity>
						</Modal>
					) }
				</ScrollView>
			) }
		</View>
	);
};

export default Index;
