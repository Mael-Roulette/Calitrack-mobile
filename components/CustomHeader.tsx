import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const CustomHeader = ({
	title,
	link,
	icon,
}: {
	title: string;
	link?: any;
	icon?: any;
}) => {
	return (
		<View className='flex-row items-center justify-between w-full'>
			<Text className='title'>{title}</Text>

			{link && (
				<Link href={link}>
					{icon}
				</Link>
			)}
		</View>
	);
};

export default CustomHeader;
