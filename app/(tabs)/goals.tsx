import { useGoalsStore } from "@/store";
import { Goal } from "@/types";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, router } from "expo-router";
import { useLayoutEffect, useMemo } from "react";
import {
	Alert,
	FlatList,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import GoalItem from "../goal/components/GoalItem";
import { MAX_GOALS } from "@/constants/value";

const Goals = () => {
	const { goals } = useGoalsStore();
	const navigation = useNavigation();

	const handleAddGoalLink = () => {
		if (goals.length >= MAX_GOALS) {
			Alert.alert(
				"Limite atteinte",
				`Vous ne pouvez pas ajouter plus de ${MAX_GOALS} objectifs.`
			);
		} else {
			router.push("/goal/add-goal");
		}
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={handleAddGoalLink} className='mr-4' accessibilityLabel="Ajouter un objectif">
					<Ionicons name='add-circle-outline' size={30} color='#132541' />
				</TouchableOpacity>
			),
		});
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [navigation, goals.length]);

	const { progressGoals, finishedGoals } = useMemo(
		() => ({
			progressGoals: goals.filter((goal) => goal.state === "in-progress"),
			finishedGoals: goals.filter((goal) => goal.state === "finished"),
		}),
		[goals]
	);

	const renderGoalItem = ({ item }: { item: Goal }) => (
		<GoalItem
			$id={item.$id}
			exercise={item.exercise}
			progress={item.progress}
			progressHistory={item.progressHistory}
			total={item.total}
			state={item.state}
			$createdAt={item.$createdAt}
			$updatedAt={item.$updatedAt}
		/>
	);

	const ListHeaderComponent = ({
		icon,
		title,
	}: {
		icon: any;
		title: string;
	}) => (
		<View className='mb-5 mt-4'>
			<View className='flex-row items-center gap-2'>
				{icon}
				<Text className='font-calsans text-2xl text-primary'>{title}</Text>
			</View>
		</View>
	);

	const sections = useMemo(() => {
		const sectionsArray = [
			{
				icon: <></>,
				title: "Objectifs en cours",
				data: progressGoals,
				showHeader: false,
			},
		];

		if (finishedGoals.length > 0) {
			sectionsArray.push({
				icon: <FontAwesome6 name='medal' size={24} color='#FC7942' />,
				title: "Mes objectifs réussis",
				data: finishedGoals,
				showHeader: true,
			});
		}

		return sectionsArray;
	}, [progressGoals, finishedGoals]);

	return (
		<View className='px-5 bg-background flex-1'>
			<View className='mb-6'>
				<Text className='indicator-text'>
					Nombre d&apos;objectifs en cours : {progressGoals.length}/{MAX_GOALS}.
				</Text>
			</View>
			{goals.length !== 0 && (
				<View className='mb-6'>
					<Text className='indicator-text'>
						Vous pouvez ajouter une nouvelle progression en cliquant sur un
						objectif.
					</Text>
				</View>
			)}
			<FlatList
				data={sections}
				keyExtractor={(item, index) => `section-${index}`}
				showsVerticalScrollIndicator={false}
				renderItem={({ item: section }) => (
					<View>
						{section.showHeader && (
							<ListHeaderComponent icon={section.icon} title={section.title} />
						)}
						<FlatList
							data={section.data}
							renderItem={renderGoalItem}
							keyExtractor={(item, index) => item.$id || `goal-${index}`}
							scrollEnabled={false}
							showsVerticalScrollIndicator={false}
							ListEmptyComponent={
								<Text className='indicator-text'>
									Aucun objectif.
								</Text>
							}
						/>
					</View>
				)}
			/>
		</View>
	);
};

export default Goals;
