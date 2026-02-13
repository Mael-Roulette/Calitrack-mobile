import { Text, View } from "react-native";
import CustomButton from "./CustomButton";
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
        <Text className="text text-lg text-background">{ title }</Text>

        <CustomButton
          title={ buttonText }
          onPress={ handlePress }
          customStyles="border-0"
        />
      </View>
    </PrimaryGradient>
  );
}