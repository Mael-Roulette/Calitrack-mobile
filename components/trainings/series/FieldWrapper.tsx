import { Text, View } from "react-native";

export default function FieldWrapper ( { label, children }: { label: string; children: React.ReactNode } ) {
  return (
    <View className="flex-1 items-center gap-1">
      <Text className="label-text text-sm text-center" numberOfLines={ 1 }>
        { label }
      </Text>
      { children }
    </View>
  );
}
