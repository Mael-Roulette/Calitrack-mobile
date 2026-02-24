import { Text, TextInput, View } from "react-native";

export function NumericField ( {
  label,
  value,
  onChangeText,
  suffix,
}: {
  label: string;
  value: number;
  onChangeText: ( v: string ) => void;
  suffix?: string;
} ) {
  return (
    <View className="flex-1 items-center gap-1">
      <Text className="label-text text-center">{label}</Text>
      <View className="custom-input py-3 border-secondary rounded-lg flex-row items-center justify-center w-full">
        <TextInput
          value={ String( value ) }
          onChangeText={ onChangeText }
          keyboardType="numeric"
          className="text-center flex-1"
          selectTextOnFocus
        />
        {suffix && (
          <Text className="text-primary-100 font-sregular text-sm ml-1 mr-3">
            {suffix}
          </Text>
        )}
      </View>
    </View>
  );
}
