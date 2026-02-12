import { Alert } from "react-native";

export const showAlert = {
  error: ( message: string, onPress?: () => void ) => {
    Alert.alert( "Erreur", message, [
      { text: "OK", onPress },
    ] );
  },

  success: ( message: string, onPress?: () => void ) => {
    Alert.alert( "Succès", message, [
      { text: "OK", onPress },
    ] );
  },

  confirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    Alert.alert( title, message, [
      { text: "Annuler", style: "cancel", onPress: onCancel },
      { text: "Confirmer", onPress: onConfirm },
    ] );
  },
};