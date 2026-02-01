import { ReactNode } from "react";
import { View } from "react-native";

interface HeaderContainerProps {
  children: ReactNode;
  paddingTop: number;
}

export function HeaderContainer ( { children, paddingTop }: HeaderContainerProps ) {
  return (
    <View className="bg-secondary rounded-b-xl">
      <View
        className="px-5 pb-6"
        style={ { paddingTop } }
      >
        {children}
      </View>
    </View>
  );
}