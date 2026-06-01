import cn from "clsx";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

interface PasswordInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: ( text: string ) => void;
  label: string;
  customStyles?: string;
}

const PasswordInput = ( {
  placeholder = "Mot de passe",
  value,
  onChangeText,
  label,
  customStyles = "",
}: PasswordInputProps ) => {
  const [ show, setShow ] = useState( false );

  return (
    <View className="w-full gap-2">
      <Text className="label-text">{label}</Text>

      <View className="relative">
        <TextInput
          autoCapitalize="none"
          autoCorrect={ false }
          value={ value }
          onChangeText={ onChangeText }
          secureTextEntry={ !show }
          placeholder={ placeholder }
          placeholderTextColor="#617188"
          className={ cn( "custom-input pr-20", customStyles ) }
        />

        <Pressable
          onPress={ () => setShow( !show ) }
          className="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <Text className="text-gray-500">
            {show ? "Masquer" : "Afficher"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PasswordInput;