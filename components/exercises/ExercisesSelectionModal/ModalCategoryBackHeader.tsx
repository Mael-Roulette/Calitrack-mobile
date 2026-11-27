import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from "react-native";

interface CategoryBackHeaderProps {
  label?: string;
  onBack: () => void;
}

export const CategoryBackHeader = ( { label, onBack }: CategoryBackHeaderProps ) => (
  <TouchableOpacity onPress={ onBack } className='flex-row items-center gap-2 mb-4'>
    <Ionicons name='chevron-back' size={ 20 } className="text-primary" />
    <Text className='title-2'>{ label }</Text>
  </TouchableOpacity>
);