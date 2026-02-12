import { ImageSourcePropType } from "react-native";

export interface TabBarIconProps {
	icon: ImageSourcePropType;
}

export interface CustomButtonProps {
	onPress?: () => void;
	title?: string;
	customStyles?: string;
	textStyles?: string;
	isLoading?: boolean;
	variant?: "primary" | "secondary" | "tertiary";
}

export interface CustomInputProps {
	placeholder?: string;
	value?: string;
	onChangeText?: ( text: string ) => void;
	label: string;
	secureTextEntry?: boolean;
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
	editable?: boolean;
	customStyles?: string;
	multiline?: boolean;
	numberOfLines?: number;
}

export interface CustomTagsProps {
	label: string;
	placeholder: string;
	suggestions?: TagOption[] | string[];
	value?: string[];
	onChangeText?: ( values: string[] ) => void;
	maxTags?: number;
	allowCustomTags?: boolean;
}

export interface TagOption {
	label: string;
	value: string;
}

export interface CalendarDay {
	dateString: string;
	day: number;
	month: number;
	year: number;
	timestamp: number;
}
