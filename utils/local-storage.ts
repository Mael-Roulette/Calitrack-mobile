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

export const getValue = async (
  key: string,
  defaultValue: string = ""
): Promise<string> => {
  try {
    const value = await AsyncStorage.getItem( key );

    if ( !value ) {
      return "";
    }

    return value;
  } catch ( error ) {
    console.log( `Erreur lecture AsyncStorage (${key}):`, error );
    return defaultValue;
  }
};

export const setValue = async (
  key: string,
  value: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem( key, value );
  } catch ( error ) {
    console.log( `Erreur écriture AsyncStorage (${key}):`, error );
  }
};