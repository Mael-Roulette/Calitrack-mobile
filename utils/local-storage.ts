import AsyncStorage from "@react-native-async-storage/async-storage";

export const getBoolean = async (
  key: string,
  defaultValue: boolean = false
): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem( key );
    return value === "true";
  } catch ( error ) {
    console.log( `Erreur lecture AsyncStorage (${key}):`, error );
    return defaultValue;
  }
};

export const setBoolean = async ( key: string, value: boolean ): Promise<void> => {
  try {
    await AsyncStorage.setItem( key, String( value ) );
  } catch ( error ) {
    console.log( `Erreur écriture AsyncStorage (${key}):`, error );
  }
};