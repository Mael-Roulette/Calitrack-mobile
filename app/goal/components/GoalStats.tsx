import { Goal } from "@/types";
import React, { FC } from "react";
import { Text, View } from "react-native";
import GoalChart from "./GoalChart";

const GoalStats: FC<Partial<Goal>> = ( {
	title,
	state,
	progressHistory = [],
	total = 0,
} ) => {
	// Récupère la valeur la plus haute du tableau
	const highestValue = progressHistory && progressHistory.length > 0
		? Math.max( ...progressHistory )
		: 0;

	let progressPercentage: number = total > 0 ? ( highestValue / total ) * 100 : 0;

	if ( progressPercentage % 1 !== 0 ) {
		progressPercentage = parseFloat( progressPercentage.toFixed( 2 ) );
	}

	return (
		<View className="px-5 py-4 border border-secondary rounded-md mb-3">
			<View className="flex-row items-center justify-between mb-2">
				<Text className="text-lg font-sregular text-primary">{ title }</Text>
				<Text
					className="text-xs font-sregular px-3 py-2 rounded-full border-[1px] border-secondary text-secondary"
				>
					{ state === 'finished' ? 'Validé' : state === 'in-progress' && 'En cours' }
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