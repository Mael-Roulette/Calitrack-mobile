import { useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function WeightInput ( {
  value,
  onChange,
}: {
  value: number | null;
  onChange: ( v: number | null ) => void;
} ) {
  const [ raw, setRaw ] = useState( value !== null ? String( value ) : "" );

  const handleChange = ( text: string ) => {
    // Autoriser vide ou "-" seul (en cours de frappe)
    if ( text === "" || text === "-" ) {
      setRaw( text );
      onChange( null );
      return;
    }

    // Filtrer tout sauf chiffres et "-" en début
    const cleaned = text.replace( /[^0-9\-]/g, "" );
    if ( cleaned.indexOf( "-" ) > 0 ) return; // "-" uniquement en premier caractère

    setRaw( cleaned );
    const parsed = parseInt( cleaned, 10 );
    onChange( isNaN( parsed ) ? null : parsed );
  };

  const isEmpty = raw === "" || raw === "-";

  return (
    <View
      className={ `border rounded-lg flex-row items-center justify-center w-full ${ isEmpty ? "border-red-400" : "border-secondary" }` }
      style={ { height: 44 } }
    >
      <TextInput
        value={ raw }
        onChangeText={ handleChange }
        keyboardType="numbers-and-punctuation"
        className="text text-center flex-1"
        placeholder="—"
        placeholderTextColor="#9ca3af"
        selectTextOnFocus
      />
      <Text className="text-primary-100 font-sregular text-xs mr-2">kg</Text>
    </View>
  );
}
