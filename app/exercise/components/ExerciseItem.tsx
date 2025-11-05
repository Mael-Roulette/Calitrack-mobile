// app/exercise/components/ExerciseItem.tsx
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ExerciseItem = ( {
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
} ) => {
	const getDifficultyColor = ( difficulty: string ) => {
		switch ( difficulty ) {
			case "beginner":
				return { traduction: "Débutant", color: "#3b82f6" };
			case "novice":
				return { traduction: "Novice", color: "#22c55e" };
			case "intermediate":
				return { traduction: "Intermédiaire", color: "#eab308" };
			case "advanced":
				return { traduction: "Avancé", color: "#f97316" };
			case "expert":
				return { traduction: "Expert", color: "#ef4444" };
			default:
				return { traduction: "Novice", color: "#22c55e" };
		}
	};

	const difficultyInfo = getDifficultyColor( difficulty );

	return (
		<TouchableOpacity
			className={ `flex-row items-center justify-between p-4 mb-3 rounded-md border border-secondary  ${isSelected
				? "border-2 bg-secondary/10"
				: "bg-background"
				}` }
			onPress={ onPress }
			disabled={ !onPress }
		>
			<View className='flex-1'>
				<Text className='text-primary font-sregular text-lg mb-1'>{ name }</Text>
				<View className='flex-row items-center gap-3'>
					<Text className='text-primary-100 text-sm font-sregular'>
						Type : { type }
					</Text>
					<Text className='text-sm font-medium text-primary-100 font-sregular'>
						Difficulté :{ " " }
						<Text style={ { color: difficultyInfo.color } }>
							{ difficultyInfo.traduction }
						</Text>
					</Text>
				</View>
			</View>

			{ onPress && selectable && (
				<View
					className={ `w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? "border-secondary bg-secondary" : "border-primary-100"
						}` }
				>
					{ isSelected && <Ionicons name='checkmark' size={ 16 } color='white' /> }
				</View>
			) }
		</TouchableOpacity>
	);
};

export default ExerciseItem;
