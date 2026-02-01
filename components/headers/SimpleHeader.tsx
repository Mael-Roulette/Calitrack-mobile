// components/headers/SimpleHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderContainer } from "./HeaderContainer";

interface SimpleHeaderProps {
  title: string;
  subtitle?: string;
  count?: string;
  onAddPress?: () => void;
}

export default function SimpleHeader ( {
  title,
  subtitle,
  count,
  onAddPress
}: SimpleHeaderProps ) {
  const insets = useSafeAreaInsets();

  return (
    <HeaderContainer paddingTop={ insets.top }>
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="title text-background">{title}</Text>

          {/* Bouton ajouter */}
          {onAddPress && (
            <TouchableOpacity
              className="bg-background rounded-full p-2"
              onPress={ onAddPress }
            >
              <Ionicons name="add-circle-outline" size={ 24 } className="text-primary" />
            </TouchableOpacity>
          )}
        </View>

        {/* Title section */}
        <View className="flex-row justify-between items-center gap-10">
          { subtitle && (
            <Text className="text text-background flex-shrink">{subtitle}</Text>
          )}

          {count && (
            <Text className="text text-background font-bold text-xl">{count}</Text>
          )}
        </View>
      </View>
    </HeaderContainer>
  );
}