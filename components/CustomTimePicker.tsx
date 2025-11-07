import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { View } from "react-native";
import { TimerPickerModal } from "react-native-timer-picker";

const CustomTimePicker = () => {
  const [ showPicker, setShowPicker ] = useState<boolean>( true );
  const [ time, setTime ] = useState<string>();

  const formatTime = ( {
    hours,
    minutes,
    seconds,
  }: {
    hours?: number;
    minutes?: number;
    seconds?: number;
  } ) => {
    const timeParts = [];

    if ( hours !== undefined ) {
      timeParts.push( hours.toString().padStart( 2, "0" ) );
    }
    if ( minutes !== undefined ) {
      timeParts.push( minutes.toString().padStart( 2, "0" ) );
    }
    if ( seconds !== undefined ) {
      timeParts.push( seconds.toString().padStart( 2, "0" ) );
    }

    return timeParts.join( ":" );
  };

  return (
    <View style={ { backgroundColor: "#F1F1F1", alignItems: "center", justifyContent: "center" } }>
      <TimerPickerModal
        visible={ showPicker }
        setIsVisible={ setShowPicker }
        onConfirm={ ( pickedDuration ) => {
          setTime( formatTime( pickedDuration ) );
          setShowPicker( false );
        } }
        modalTitle="Set Alarm"
        onCancel={ () => setShowPicker( false ) }
        closeOnOverlayPress
        use12HourPicker
        LinearGradient={ LinearGradient }
        styles={ {
          theme: "light",
        } }
      />
    </View>
  )
}

export default CustomTimePicker;