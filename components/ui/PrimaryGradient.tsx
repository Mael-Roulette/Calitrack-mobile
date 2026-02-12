import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export default function PrimaryGradient ( { children, style, ...props }: { children: any, style?: any } ) {
  return (
    <LinearGradient
      colors={ [ "#132541", "#FC7942" ] }
      start={ { x: 0, y: 0 } }
      end={ { x: 1, y: 1 } }
      style={ [ styles.gradient, style ] }
      { ...props }
    >
      { children }
    </LinearGradient>
  );
}

const styles = StyleSheet.create( {
  gradient: {
    borderRadius: 10,
  },
} );