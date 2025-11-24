import { MAX_GOALS } from "@/constants/value";
import { useGoalsStore } from "@/store";
import { Goal } from "@/types";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useMemo } from "react";
import {
	FlatList,
	Text,
	View
} from "react-native";
import GoalItem from "../goal/components/GoalItem";

const Goals = () => {
	const { goals } = useGoalsStore();

	const { progressGoals, finishedGoals } = useMemo(
		() => ( {
			progressGoals: goals.filter( ( goal ) => goal.state === "in-progress" ),
			finishedGoals: goals.filter( ( goal ) => goal.state === "finish" ),
		} ),
		[ goals ]
	);

	const renderGoalItem = ( { item }: { item: Goal } ) => (
		<GoalItem
			$id={ item.$id }
			exercise={ item.exercise }
			progress={ item.progress }
			total={ item.total }
			state={ item.state }
			canDelete={ true }
		/>
	);

	const ListHeaderComponent = ( {
		icon,
		title,
	}: {
		icon: any;
		title: string;
	} ) => (
		<View className='mb-5 mt-4'>
			<View className='flex-row items-center gap-2'>
				{ icon }
				<Text className='font-calsans text-2xl text-primary'>{ title }</Text>
			</View>
		</View>
	);

	const sections = useMemo( () => {
		const sectionsArray = [
			{
				icon: <></>,
				title: "Objectifs en cours",
				data: progressGoals,
				showHeader: false,
			},
		];

		if ( finishedGoals.length > 0 ) {
			sectionsArray.push( {
				icon: <FontAwesome6 name='medal' size={ 24 } color='#FC7942' />,
				title: "Mes objectifs réussis",
				data: finishedGoals,
				showHeader: true,
			} );
		}

		return sectionsArray;
	}, [ progressGoals, finishedGoals ] );

	return (
		<View className='px-5 bg-background flex-1'>
			<View className='mb-6 flex-row items-center justify-end gap-4'>
				{ goals.length !== 0 && (
					<Text className='indicator-text shrink'>
						Vous pouvez ajouter une nouvelle progression en cliquant sur un
						objectif.
					</Text>
				) }

				<Text className='indicator-text text-xl'>{ progressGoals.length }/{ MAX_GOALS }</Text>
			</View>
			<FlatList
				data={ sections }
				keyExtractor={ ( item, index ) => `section-${index}` }
				showsVerticalScrollIndicator={ false }
				renderItem={ ( { item: section } ) => (
					<View>
						{ section.showHeader && (
							<ListHeaderComponent icon={ section.icon } title={ section.title } />
						) }
						<FlatList
							data={ section.data }
							renderItem={ renderGoalItem }
							keyExtractor={ ( item, index ) => item.$id || `goal-${index}` }
							scrollEnabled={ false }
							showsVerticalScrollIndicator={ false }
							ListEmptyComponent={
								<Text className='indicator-text'>
									Aucun objectif.
								</Text>
							}
						/>
					</View>
				) }
			/>
		</View>
	);
};

export default Goals;
