import { CustomButtonProps } from "@/types";
import cn from "clsx";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

const CustomButton = ({
	title,
	onPress,
	customStyles,
	textStyles,
	variant = "primary",
	isLoading = false,
}: CustomButtonProps) => {
	const buttonVariants = {
		primary: "bg-secondary",
		secondary: "bg-background border border-secondary",
	};

	const textVariants = {
		primary: "text-background",
		secondary: "text-secondary",
	};

	return (
		<TouchableOpacity
			onPress={onPress}
			className={cn(
				"custom-btn",
				buttonVariants[variant],
				isLoading ? "opacity-50" : "",
				customStyles
			)}
			disabled={isLoading}
		>
			<Text
				className={cn(
					"font-sregular text-lg",
					textVariants[variant],
					textStyles
				)}
			>
				{title}
			</Text>
		</TouchableOpacity>
	);
};
export default CustomButton;
