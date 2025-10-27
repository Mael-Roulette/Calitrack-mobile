import { useAuthStore, useGoalsStore } from "@/store";
import React, { useMemo } from "react";
import { Text, View } from "react-native";
import PrimaryGradient from "./PrimaryGradient";

const ProgressOverview = () => {
	const { goals } = useGoalsStore();
	const { user } = useAuthStore();
	const finishGoalsNumber = useMemo(
		() => goals.filter((goal) => goal.state === "finished").length,
		[goals]
	);

	return (
		<PrimaryGradient>
			<View className='w-full p-5 flex-col gap-5'>
				<Text className='text-2xl text-background font-calsans'>
					Progression générale
				</Text>
				<View className='w-full flex-row gap-3'>
					<View className='flex-1 h-full bg-background/20 rounded-md p-4 flex-col gap-1'>
						<Text className='text-3xl text-background font-calsans'>{user?.completedTrainings || 0}</Text>
						<Text className='text-base text-background font-sregular'>
							Séance(s) complétée(s)
						</Text>
					</View>

					<View className='flex-1 h-full bg-background/20 rounded-md p-4 flex-col gap-1'>
						<Text className='text-3xl text-background font-calsans'>
							{finishGoalsNumber}
						</Text>
						<Text className='text-base text-background font-sregular'>
							Objectif(s) atteint(s)
						</Text>
					</View>
				</View>
			</View>
		</PrimaryGradient>
	);
};

export default ProgressOverview;
