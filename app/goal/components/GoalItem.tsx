import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { updateGoal } from "@/lib/goal.appwrite";
import { useGoalsStore } from "@/store";
import { Goal } from "@/types";
import { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";

const GoalItem = ({
	$id,
	title,
	progress,
	total,
	state,
}: Goal) => {
	const [modalVisible, setModalVisible] = useState(false);
	const [newProgress, setNewProgress] = useState<string>();
	const [isUpdating, setIsUpdating] = useState(false);
	const { fetchUserGoals } = useGoalsStore();

	const handleUpdateProgress = async () => {
		if (!newProgress) {
			Alert.alert("Erreur", "Veuillez entrer une valeur");
			return;
		}

		const progressValue = parseInt(newProgress);

		setIsUpdating(true);
		try {
			if (!$id) {
				throw new Error("L'id n'est pas défini");
			}

			await updateGoal($id, {
				progress: progressValue,

				state: progressValue >= total ? "finish" : "in-progress",
				updateDate: new Date().toISOString(),
			});

			await fetchUserGoals();
			setModalVisible(false);
		} catch (error) {
			console.error(error);
			Alert.alert("Erreur", "Impossible de mettre à jour l'objectif");
		} finally {
			setIsUpdating(false);
		}
	};

	const renderProgress = () => {
		if (state !== "in-progress") return null;

		return (
			<View className='mt-4'>
				<View className='flex-row justify-between mb-3'>
					<Text>Progression</Text>
					<Text>
						{progress} / {total}
					</Text>
				</View>
				<Progress.Bar
					progress={progress / total}
					width={null}
					unfilledColor='#e0e0e0'
					borderWidth={0}
					color={"rgba(252, 121, 66, 1)"}
				/>
			</View>
		);
	};

	const renderContent = () => {
		switch (state) {
			case "in-progress":
				return renderProgress();
			case "finish":
				return null;
			default:
				return <Text>{state}</Text>;
		}
	};

	return (
		<>
			<TouchableOpacity
				onPress={() => state === "in-progress" && setModalVisible(true)}
				activeOpacity={state === "in-progress" ? 0.7 : 1}
			>
				<View
					className={`w-full px-5 py-4 mb-4 border-[1px] rounded-xl border-secondary`}
				>
					<View className='flex-row justify-between items-center gap-2'>
						<Text className='font-sregular text-primary text-lg'>{title}</Text>
						<Text
							className={`text-xs font-sregular px-3 py-2 rounded-full border-[1px] border-secondary text-secondary`}
						>
							{ state === 'finish' ? 'Validé' : state === 'in-progress' && 'En cours' }
						</Text>
					</View>
					{renderContent()}
				</View>
			</TouchableOpacity>

			<Modal
				animationType='slide'
				transparent={true}
				visible={modalVisible}
				statusBarTranslucent={true}
				onRequestClose={() => setModalVisible(false)}
			>
				<View className='flex-1 justify-center items-center bg-black/50'>
					<View className='bg-background w-[80%] p-5 rounded-xl'>
						<Text className='text-2xl font-calsans text-primary mb-4'>
							Mise à jour
						</Text>

						<Text className='font-sregular text-lg mb-2 text-primary'>
							{title}
						</Text>

						<CustomInput
							label='Nouvelle progression'
							value={newProgress}
							placeholder={`${progress}`}
							keyboardType='numeric'
							onChangeText={setNewProgress}
						/>

						<View className='flex-col gap-2 mt-5'>
							<CustomButton
								title='Mettre à jour'
								onPress={handleUpdateProgress}
								isLoading={isUpdating}
							/>
							<CustomButton
								title='Annuler'
								onPress={() => setModalVisible(false)}
								variant='secondary'
							/>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
};

export default GoalItem;
