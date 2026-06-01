// components/headers/PageHeader.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderContainer } from "./HeaderContainer";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface PageHeaderProps {
  title: string;
  canGoBack?: boolean;
  onBackPress?: () => void;
  onRightPress?: () => void;
  rightIcon?: IoniconName;
}

export default function PageHeader ( {
  title,
  canGoBack = true,
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
    <HeaderContainer paddingTop={ insets.top }>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 flex-1">
          { canGoBack &&
            <TouchableOpacity onPress={ handleBack }>
              <Ionicons name="arrow-back" size={ 28 } color="white" />
            </TouchableOpacity>
          }

          <Text className="title text-background flex-1 truncate" numberOfLines={ 1 }>{title}</Text>
        </View>

        {onRightPress && (
          <TouchableOpacity
            className="bg-background rounded-full p-2"
            onPress={ onRightPress }
          >
            <Ionicons name={ rightIcon } size={ 24 } className="text-primary" />

          </TouchableOpacity>
        )}
      </View>
    </HeaderContainer>
  );
}