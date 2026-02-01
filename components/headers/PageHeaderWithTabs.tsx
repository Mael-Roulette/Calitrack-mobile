// components/headers/PageHeaderWithTabs.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HeaderContainer } from "./HeaderContainer";

interface PageHeaderWithTabsProps {
  title: string;
  tabs: string[];
  activeTab: string;
  onTabPress: ( tab: string ) => void;
  onBackPress?: () => void;
  rightActions?: React.ReactNode;
}

export default function PageHeaderWithTabs ( {
  title,
  tabs,
  activeTab,
  onTabPress,
  onBackPress,
  rightActions
}: PageHeaderWithTabsProps ) {
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
      <View className="flex-row justify-between items-center mb-4">
        <TouchableOpacity onPress={ handleBack }>
          <Ionicons name="arrow-back" size={ 28 } color="white" />
        </TouchableOpacity>
        {rightActions}
      </View>

      <Text className="text-white text-3xl font-bold mb-4">{title}</Text>

      {/* Tabs */}
      <View className="flex-row gap-2">
        {tabs.map( ( tab ) => (
          <TouchableOpacity
            key={ tab }
            className={ `px-4 py-2 rounded-full border ${
              activeTab === tab
                ? "bg-white border-white"
                : "bg-transparent border-white"
            }` }
            onPress={ () => onTabPress( tab ) }
          >
            <Text
              className={ `font-medium ${
                activeTab === tab ? "text-[#FC7942]" : "text-white"
              }` }
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ) )}
      </View>
    </HeaderContainer>
  );
}