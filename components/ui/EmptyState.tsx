import { Text, TouchableOpacity, View } from "react-native";
import PrimaryGradient from "./PrimaryGradient";

interface EmptyStateProps {
  title: string;
  buttonText: string;
  handlePress: () => void;
}

export default function EmptyState ( { title, buttonText, handlePress }: EmptyStateProps ) {
  return (
    <PrimaryGradient>
      <View className='px-4 py-4 gap-5'>
        <Text className="text text-background">{ title }</Text>

        <TouchableOpacity className="btn-primary border-0" onPress={ handlePress }>
          <Text className="text-secondary font-bold text-lg">{ buttonText }</Text>
        </TouchableOpacity>
      </View>
    </PrimaryGradient>
  );
}