import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { deleteGoal, updateGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { GoalItemProps } from "@/types";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, GestureResponderEvent, Modal, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";

const GoalItem = ( {
	canDelete = false,
	$id,
	exercise,
	progress,
	total,
	state,
}: GoalItemProps & { canDelete?: boolean } ) => {
	const [ modalVisible, setModalVisible ] = useState( false );
	const [ newProgress, setNewProgress ] = useState<string>();
	const [ isUpdating, setIsUpdating ] = useState( false );
	const [ showDelete, setShowDelete ] = useState( false );
	const { updateGoalStore, deleteGoalStore } = useGoalsStore();

	const handleUpdateProgress = async () => {
		if ( !newProgress ) {
			Alert.alert( "Erreur", "Veuillez entrer une valeur" );
			return;
		}

		const progressValue = parseInt( newProgress );

		setIsUpdating( true );
		try {
			if ( !$id ) {
				throw new Error( "L'id n'est pas défini" );
			}

			await updateGoal( {
				$id,
				progress: progressValue,
			} );

			await updateGoalStore( $id, { progress: progressValue } );
			setModalVisible( false );
		} catch ( error ) {
			console.error( error );
			Alert.alert( "Erreur", "Impossible de mettre à jour l'objectif" );
		} finally {
			setIsUpdating( false );
		}
	};

	const renderProgress = () => {
		if ( state !== "in-progress" ) return null;

		return (
			<View className='mt-4'>
				<View className='flex-row justify-between mb-3'>
					<Text>Progression</Text>
					<Text>
						{ progress } / { total }
					</Text>
				</View>
				<Progress.Bar
					progress={ progress / total }
					width={ null }
					unfilledColor='#e0e0e0'
					borderWidth={ 0 }
					color={ "rgba(252, 121, 66, 1)" }
				/>
			</View>
		);
	};

	const renderContent = () => {
		switch ( state ) {
			case "in-progress":
				return renderProgress();
			case "finish":
				return null;
			default:
				return <Text>{ state }</Text>;
		}
	};

	function handleDelete ( event: GestureResponderEvent ): void {
		setShowDelete( false );
		deleteGoal( $id )
			.then( () => deleteGoalStore( $id ) );
	}

	return (
		<>
			<TouchableOpacity
				onPress={ () => state === "in-progress" && setModalVisible( true ) }
				activeOpacity={ state === "in-progress" ? 0.7 : 1 }
			>
				<View
					className={ `w-full px-5 py-4 mb-4 border-[1px] rounded-xl border-secondary` }
				>
					<View className='flex-row justify-between items-start gap-4'>
						<View className="flex-row gap-2 items-center gap-5">
							<Text className='font-sregular text-primary text-lg'>{ exercise.name }</Text>
							<Text
								className={ `text-xs font-sregular px-3 py-2 rounded-full border-[1px] border-secondary text-secondary` }
							>
								{ state === 'finish' ? 'Validé' : state === 'in-progress' && 'En cours' }
							</Text>
						</View>
						{ state === 'in-progress' && canDelete && (
							<TouchableOpacity
								onPress={ () => setShowDelete( !showDelete ) }
								accessibilityLabel='Voir les options'
								style={ { paddingLeft: 24 } }
							>
								<Feather name='trash-2' size={ 20 } color='#ef4444' />
							</TouchableOpacity>
						) }
					</View>
					{ renderContent() }
				</View>
			</TouchableOpacity>

			<Modal
				animationType='slide'
				transparent={ true }
				visible={ modalVisible }
				statusBarTranslucent={ true }
				onRequestClose={ () => setModalVisible( false ) }
			>
				<View className='flex-1 justify-center items-center bg-black/50'>
					<View className='bg-background w-[80%] p-5 rounded-xl'>
						<Text className='text-xl font-calsans text-primary mb-4'>
							{ exercise.name }
						</Text>

						<CustomInput
							label='Ajouter une progression'
							value={ newProgress }
							placeholder={ `${progress}` }
							keyboardType='numeric'
							onChangeText={ setNewProgress }
						/>

						<View className='flex-col gap-2 mt-5'>
							<CustomButton
								title='Mettre à jour'
								onPress={ handleUpdateProgress }
								isLoading={ isUpdating }
							/>
							<CustomButton
								title='Annuler'
								onPress={ () => setModalVisible( false ) }
								variant='secondary'
							/>
						</View>
					</View>
				</View>
			</Modal>

			{ showDelete && (
				<Modal
					transparent={ true }
					visible={ showDelete }
					animationType='fade'
					onRequestClose={ () => setShowDelete( false ) }
				>
					<TouchableOpacity
						style={ { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }
						activeOpacity={ 1 }
						onPress={ () => setShowDelete( false ) }
					>
						<View className="w-4/5 h-fit flex-col justify-center items-center gap-4 py-4 px-6 bg-background rounded-md">
							<View>
								<Text className="text-center font-sora">Êtes-vous sûr de supprimer cet objectif ? Cette action est irréversible.</Text>
							</View>
							<TouchableOpacity
								onPress={ handleDelete }
								className='flex-row items-center justify-center px-4 py-3 w-full border border-secondary rounded-md'
							>
								<Feather name='trash-2' size={ 18 } color='#ef4444' />
								<Text className='ml-3 text-base text-red-500 font-sregular'>
									Supprimer
								</Text>
							</TouchableOpacity>
						</View>
					</TouchableOpacity>
				</Modal>
			) }
		</>
	);
};

export default GoalItem;
