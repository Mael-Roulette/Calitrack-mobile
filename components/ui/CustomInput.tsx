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
    <View className='w-full gap-1'>
      <Text className='font-sregular text-lg text-primary'>{ label }</Text>

      <TextInput
        textAlignVertical="top"
        autoCapitalize='none'
        autoCorrect={ false }
        value={ value }
        onChangeText={ onChangeText }
        secureTextEntry={ secureTextEntry }
        keyboardType={ keyboardType }
        placeholder={ placeholder }
        placeholderTextColor={ "#AEC4E7" }
        className={ cn( "custom-input", customStyles ) }
        editable={ editable }
        multiline={ multiline }
        numberOfLines={ numberOfLines }
      />
    </View>
  );
};
export default CustomInput;