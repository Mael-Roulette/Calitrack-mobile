import { useGoalsStore } from "@/store";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoalStats from "./components/GoalStats";

const Stats = () => {
	const { goals } = useGoalsStore();

	return (
		<SafeAreaView className='bg-background min-h-full flex-1'>
			<ScrollView className='px-5'>
				<View className='flex-col gap-5'>
					{goals.map((goal) => (
						<GoalStats
							key={goal.$id}
							title={goal.title}
							state={goal.state ?? ""}
							progressHistory={goal.progressHistory}
							total={goal.total}
						/>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default Stats;
