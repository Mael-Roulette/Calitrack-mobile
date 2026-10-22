import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function FieldInput ( {
  value,
  onChangeValue,
  min = 1,
  suffix,
}: {
  value: number;
  onChangeValue: ( v: number ) => void;
  min?: number;
  suffix?: string;
} ) {
  const [ text, setText ] = useState( String( value ) );

  useEffect( () => {
    setText( ( prev ) => {
      // Ne pas écraser un champ vide en cours d'édition
      if ( prev === "" ) return prev;
      return String( value ) !== prev ? String( value ) : prev;
    } );
  }, [ value ] );

  const handleChange = ( v: string ) => {
    // Garde uniquement les chiffres
    const cleaned = v.replace( /[^0-9]/g, "" );
    setText( cleaned );

    if ( cleaned !== "" ) {
      onChangeValue( Math.max( min, parseInt( cleaned, 10 ) ) );
    }
  };

  const handleBlur = () => {
    // Si vide au moment de quitter le champ, on remet le minimum
    if ( text === "" ) {
      setText( String( min ) );
      onChangeValue( min );
    } else {
      // Normalise l'affichage (ex: "0" -> "1", "007" -> "7")
      setText( String( Math.max( min, parseInt( text, 10 ) ) ) );
    }
  };

  return (
    <View
      className="border border-secondary rounded-lg flex-row items-center justify-center w-full"
      style={ { height: 44 } }
    >
      <TextInput
        value={ text }
        onChangeText={ handleChange }
        onBlur={ handleBlur }
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