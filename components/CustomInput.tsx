import { CustomInputProps } from "@/types";
import cn from "clsx";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";

const CustomInput = ({
	placeholder = "Entrer du texte",
	value,
	onChangeText,
	label,
	secureTextEntry = false,
	keyboardType = "default",
	editable = true,
	customStyles = "",
}: CustomInputProps) => {
	const [isFocused, setIsFocused] = useState(false);

	return (
		<View className='w-full gap-1'>
			<Text className='font-sregular text-lg text-primary'>{label}</Text>

			<TextInput
				autoCapitalize='none'
				autoCorrect={false}
				value={value}
				onChangeText={onChangeText}
				secureTextEntry={secureTextEntry}
				keyboardType={keyboardType}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder={placeholder}
				className={cn("custom-input", customStyles)}
				editable={editable}
			/>
		</View>
	);
};
export default CustomInput;
