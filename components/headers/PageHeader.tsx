// components/headers/PageHeader.tsx
import { Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderContainer } from "./HeaderContainer";

interface PageHeaderProps {
  title: string;
  onBackPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: "add" | "menu";
}

export default function PageHeader ( {
  title,
  onBackPress,
  onRightPress,
  rightIcon = "add"
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
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 flex-1">
          {/* Back button */}
          <TouchableOpacity onPress={ handleBack }>
            <Ionicons name="arrow-back" size={ 28 } color="white" />
          </TouchableOpacity>

          <Text className="title text-background flex-1 truncate" numberOfLines={ 1 }>{title}</Text>
        </View>

        {onRightPress && (
          <TouchableOpacity
            className="bg-background rounded-full p-2"
            onPress={ onRightPress }
          >
            { rightIcon === "add" &&
              <Ionicons name="add-circle-outline" size={ 24 } className="text-primary" />
            }
            { rightIcon === "menu" &&
            <Entypo name="dots-three-vertical" size={ 24 } className="text-primary" />
            }
          </TouchableOpacity>
        )}
      </View>
    </HeaderContainer>
  );
}