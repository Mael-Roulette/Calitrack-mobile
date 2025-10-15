import { View, Text } from "react-native";
import React, { FC } from "react";
import GoalChart from "./GoalChart";

type GoalState = "in-progress" | "finish";

interface GoalStatsProps {
	title: string;
	state: GoalState;
	progressHistory: number[];
	total: number;
}

const GoalStats: FC<GoalStatsProps> = ( {
	title,
	state,
	progressHistory,
	total,
} ) => {
	const stateLabels: Record<GoalState, string> = {
		"in-progress": "En cours",
		finish: "validé",
	};

	const highestValue =
		progressHistory && progressHistory.length > 0
			? Math.max( ...progressHistory )
			: 0;

	let progressPercentage: number | string =
		total > 0 ? ( highestValue / total ) * 100 : 0;

	if ( progressPercentage % 1 !== 0 ) {
		progressPercentage = progressPercentage.toFixed( 2 );
	}

	return (
		<View className="px-5 py-4 border border-secondary rounded-md mb-3">
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-lg font-sregular text-primary">{ title }</Text>
				<Text
					className="text-xs font-sregular px-3 py-2 rounded-full border-[1px] border-secondary text-secondary"
				>
					{ stateLabels[ state ] }
				</Text>
			</View>
			<Text className="text-primary-100 font-sregular mb-7">
				Record actuel : { highestValue }
			</Text>
			<GoalChart progressHistory={ progressHistory } total={ total } />
			<View className="flex-col justify-center items-center gap-2 mt-3">
				<Text className="text-4xl font-calsans text-secondary text-center">
					{ progressPercentage }%
				</Text>
				<Text className="text-lg text-primary font-sregular text-center">
					Progression
				</Text>
			</View>
		</View>
	);
};

export default GoalStats;