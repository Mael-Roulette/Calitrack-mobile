import { Text, TextInput, View } from "react-native";

export default function FieldInput ( {
  value,
  onChangeText,
  suffix,
}: {
  value: number;
  onChangeText: ( v: string ) => void;
  suffix?: string;
} ) {
  return (
    <View
      className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
      style={ { height: 44 } }
    >
      <TextInput
        value={ String( value ) }
        onChangeText={ onChangeText }
        keyboardType="numeric"
        className="text text-center flex-1"
        selectTextOnFocus
      />
      { suffix && (
        <Text className="text-primary-100 font-sregular text-xs mr-2">
          { suffix }
        </Text>
      ) }
    </View>
  );
}
