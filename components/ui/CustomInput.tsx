import { CustomInputProps } from "@/types";
import cn from "clsx";
import { Text, TextInput, View } from "react-native";

const CustomInput = ( {
  placeholder = "Entrer du texte",
  value,
  onChangeText,
  label,
  secureTextEntry = false,
  keyboardType = "default",
  editable = true,
  customStyles = "",
  multiline = false,
  numberOfLines = 1,
}: CustomInputProps ) => {
  return (
    <View className='w-full gap-2'>
      <Text className='label-text'>{label}</Text>

      <TextInput
        textAlignVertical={ multiline ? "top" : "center" }
        autoCapitalize='none'
        autoCorrect={ false }
        value={ value }
        onChangeText={ onChangeText }
        secureTextEntry={ secureTextEntry }
        keyboardType={ keyboardType }
        placeholder={ placeholder }
        placeholderTextColor='#617188'
        className={ cn( "custom-input", customStyles ) }
        editable={ editable }
        multiline={ multiline }
        numberOfLines={ numberOfLines }
      />
    </View>
  );
};

export default CustomInput;