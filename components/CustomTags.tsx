import { CustomTagsProps, TagOption } from "@/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useEffect, useMemo, useState } from "react";
import {
	Alert,
	Keyboard,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";

const CustomTags = ({
	label,
	placeholder,
	suggestions = [],
	value = [],
	onChangeText,
	maxTags = 10,
	allowCustomTags = false,
}: CustomTagsProps) => {
	const [inputValue, setInputValue] = useState("");
	const [selectedValues, setSelectedValues] = useState<string[]>(value);
	const [filteredSuggestions, setFilteredSuggestions] = useState<TagOption[]>(
		[]
	);
	const [showSuggestions, setShowSuggestions] = useState(false);

	// Normaliser les suggestions pour toujours avoir le format {label, value}
	const normalizedSuggestions = useMemo<TagOption[]>(() => {
		return suggestions.map((suggestion) => {
			if (typeof suggestion === "string") {
				return { label: suggestion, value: suggestion };
			}
			return suggestion;
		});
	}, [suggestions]);

	// Fonction pour obtenir le label à partir d'une valeur
	const getLabelFromValue = (val: string): string => {
		const option = normalizedSuggestions.find((s) => s.value === val);
		return option ? option.label : val;
	};

	// Uniquement initialiser au montage, pas à chaque changement de value
	useEffect(() => {
		setSelectedValues(value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const updateParent = (newValues: string[]) => {
		if (onChangeText && JSON.stringify(newValues) !== JSON.stringify(value)) {
			onChangeText(newValues);
		}
	};

	useEffect(() => {
		if (inputValue.trim()) {
			const filtered = normalizedSuggestions.filter(
				(item) =>
					!selectedValues.includes(item.value) &&
					item.label.toLowerCase().includes(inputValue.toLowerCase())
			);
			setFilteredSuggestions(filtered);
			setShowSuggestions(filtered.length > 0);
		} else {
			setFilteredSuggestions([]);
			setShowSuggestions(false);
		}
	}, [inputValue, normalizedSuggestions, selectedValues]);

	const handleAddTag = (option: TagOption | string): void => {
		let tagValue: string;

		if (typeof option === "string") {
			tagValue = option.trim();
		} else {
			tagValue = option.value;
		}

		if (!tagValue) return;

		if (selectedValues.length >= maxTags) {
			Alert.alert(
				"Limite atteinte",
				`Vous ne pouvez ajouter que ${maxTags} tags maximum.`
			);
			return;
		}

		if (selectedValues.includes(tagValue)) {
			Alert.alert("Tag déjà ajouté", "Ce tag est déjà dans votre sélection.");
			return;
		}

		// Vérifier si le tag est dans les suggestions ou si les tags personnalisés sont autorisés
		const existsInSuggestions = normalizedSuggestions.some(
			(s) => s.value === tagValue
		);
		if (existsInSuggestions || allowCustomTags) {
			const newValues = [...selectedValues, tagValue];
			setSelectedValues(newValues);
			updateParent(newValues); // Mettre à jour le parent explicitement
			setInputValue("");
			setShowSuggestions(false);
			Keyboard.dismiss();
		} else {
			Alert.alert(
				"Tag non autorisé",
				"Veuillez choisir parmi les options disponibles."
			);
		}
	};

	const handleRemoveTag = (index: number): void => {
		const newValues = [...selectedValues];
		newValues.splice(index, 1);
		setSelectedValues(newValues);
		updateParent(newValues);
	};

	const handleSubmitEditing = (): void => {
		if (allowCustomTags && inputValue.trim()) {
			handleAddTag(inputValue);
		}
	};

	return (
		<View className='w-full gap-1 mb-2'>
			<View className='flex-row justify-between items-center'>
				<Text className='text'>{label}</Text>
				<Text className='text-sm font-sregular text-primary-100'>
					{selectedValues.length}/{maxTags}
				</Text>
			</View>

			{/* Tags display and input */}
			<View className='flex-row flex-wrap items-center border border-primary-100 rounded-md p-2 min-h-[50px]'>
				{selectedValues.map((tagValue, index) => (
					<View
						key={`${tagValue}-${index}`}
						className='bg-background border border-secondary rounded-full px-3 py-1 m-1 items-center justify-center'
					>
						<TouchableOpacity
							className='flex-row items-center'
							onPress={() => handleRemoveTag(index)}
						>
							<Text className='mr-1 text-primary'>
								{getLabelFromValue(tagValue)}
							</Text>
							<AntDesign name='close' size={20} color='#132541' />
						</TouchableOpacity>
					</View>
				))}

				<TextInput
					value={inputValue}
					onChangeText={setInputValue}
					placeholder={selectedValues.length === 0 ? placeholder : ""}
					placeholderTextColor={"#AEC4E7"}
					className='flex-1 min-w-[100px] p-1 placeholder:text-lg'
					onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
					onBlur={() => {
						setTimeout(() => setShowSuggestions(false), 150);
					}}
					onSubmitEditing={handleSubmitEditing}
					returnKeyType='done'
					editable={allowCustomTags}
				/>
			</View>

			{/* Autocomplete suggestions */}
			{showSuggestions && (
				<ScrollView
					className='max-h-[150px] border border-gray-200 rounded-md mt-1 bg-white shadow-sm'
					keyboardShouldPersistTaps='handled'
					showsVerticalScrollIndicator={false}
				>
					{filteredSuggestions.map((suggestion, index) => (
						<TouchableOpacity
							key={`suggestion-${suggestion.value}-${index}`}
							className='p-3 border-b border-gray-100 active:bg-gray-50'
							onPress={() => handleAddTag(suggestion)}
						>
							<Text className='text-primary'>{suggestion.label}</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			)}

			{/* suggestions */}
			{normalizedSuggestions.length > 0 && (
				<View className='mt-2'>
					<Text className='text-sm text-primary-100 font-sregular mb-2'>
						Options disponibles:
					</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className='flex-row'
					>
						<View className='flex-row flex-wrap'>
							{normalizedSuggestions
								.filter((s) => !selectedValues.includes(s.value))
								.slice(0, 10)
								.map((suggestion, index) => (
									<TouchableOpacity
										key={`available-${suggestion.value}-${index}`}
										onPress={() => handleAddTag(suggestion)}
										className='bg-gray-100 rounded-full px-3 py-2 m-1'
										disabled={selectedValues.length >= maxTags}
									>
										<Text
											className={`text-sm font-sregular ${selectedValues.length >= maxTags ? "text-gray-400" : "text-gray-700"}`}
										>
											{suggestion.label}
										</Text>
									</TouchableOpacity>
								))}
						</View>
					</ScrollView>
				</View>
			)}

			{allowCustomTags && (
				<Text className='text-xs text-gray-400 mt-1'>
					Appuyez sur &quot;Terminé&quot; pour ajouter un tag personnalisé
				</Text>
			)}
		</View>
	);
};

export default CustomTags;
