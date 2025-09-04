// app/exercise/components/ExerciseItem.tsx
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ExerciseItem = ({
	name,
	type,
	difficulty,
	selectable = false,
	isSelected = false,
	onPress,
}: {
	name: string;
	type: string;
	difficulty: string;
	selectable?: boolean;
	isSelected?: boolean;
	onPress?: () => void;
}) => {
	const getDifficultyColor = (difficulty: string) => {
		switch (difficulty) {
			case "beginner":
				return "#3b82f6";
			case "novice":
				return "#22c55e";
			case "intermediate":
				return "#eab308";
			case "advanced":
				return "#f97316";
			case "expert":
				return "#ef4444";
			default:
				return "#f1f5f9";
		}
	};

	return (
		<TouchableOpacity
			className={`flex-row items-center justify-between p-4 mb-3 rounded-md border ${
				isSelected
					? "border-secondary bg-secondary/10"
					: "border-primary-100 bg-background"
			}`}
			onPress={onPress}
			disabled={!onPress}
		>
			<View className='flex-1'>
				<Text className='text-primary font-sregular text-lg mb-1'>{name}</Text>
				<View className='flex-row items-center gap-3'>
					<Text className='text-primary-100 text-sm font-sregular'>
						Type : {type}
					</Text>
					<Text className='text-sm font-medium text-primary-100 font-sregular'>
						Difficulté :{" "}
						<Text style={{ color: getDifficultyColor(difficulty) }}>
							{difficulty}
						</Text>
					</Text>
				</View>
			</View>

			{onPress && selectable && (
				<View
					className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
						isSelected ? "border-secondary bg-secondary" : "border-primary-100"
					}`}
				>
					{isSelected && <Ionicons name='checkmark' size={16} color='white' />}
				</View>
			)}
		</TouchableOpacity>
	);
};

export default ExerciseItem;
