// components/headers/PageHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderContainer } from "./HeaderContainer";

interface PageHeaderProps {
  title: string;
  onBackPress?: () => void;
}

export default function PageHeader ( {
  title,
  onBackPress,
}: PageHeaderProps ) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if ( onBackPress ) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <HeaderContainer paddingTop={ insets.top + 12 }>
      <View className="flex-row items-center gap-4">
        {/* Back button */}
        <TouchableOpacity onPress={ handleBack }>
          <Ionicons name="arrow-back" size={ 28 } color="white" />
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold">{title}</Text>
      </View>
    </HeaderContainer>
  );
}