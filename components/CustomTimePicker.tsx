import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { TimerPickerModal } from "react-native-timer-picker";

interface TimePickerProps {
  label: string;
  value: number;
  showSeconds?: boolean;
  showHours?: boolean;
  minutesInterval?: number;
  onChange: ( duration: number ) => void;
}

const CustomTimePicker = ( { label, value, showSeconds = true, showHours = true, minutesInterval = 1, onChange }: TimePickerProps ) => {
  const [ visible, setVisible ] = useState( false );

  const formatDuration = ( totalSeconds: number ) => {
    const h = Math.floor( totalSeconds / 3600 )
      .toString()
      .padStart( 2, "0" );

    const m = Math.floor( ( totalSeconds % 3600 ) / 60 )
      .toString()
      .padStart( 2, "0" );

    const s = Math.floor( totalSeconds % 60 )
      .toString()
      .padStart( 2, "0" );

    if ( showHours && showSeconds ) {
      return `${h}:${m}:${s}`;
    }

    if ( showHours && !showSeconds ) {
      return `${h}:${m}`;
    }

    if ( !showHours && showSeconds ) {
      return `${m}:${s}`;
    }

    return `${m}`;
  };



  return (
    <View>
      <Text className="text mb-2">{ label }</Text>

      <Pressable
        onPress={ () => setVisible( true ) }
        className="custom-input py-3"
      >
        <Text className="text-lg text-primary">
          { formatDuration( value ) }
        </Text>
      </Pressable>

      <TimerPickerModal
        visible={ visible }
        setIsVisible={ setVisible }
        onConfirm={ ( { hours = 0, minutes = 0, seconds = 0 } ) => {
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          onChange( totalSeconds );
          setVisible( false );
        } }
        onCancel={ () => setVisible( false ) }
        modalTitle={ label }
        closeOnOverlayPress
        use12HourPicker={ false }
        cancelButtonText="Annuler"
        confirmButtonText="Confirmer"
        styles={ {
          theme: "light",
          text: {
            fontSize: 20
          }
        } }
        hideSeconds={ !showSeconds }
        padSecondsWithZero={ true }
        secondInterval={ 5 }
        hideHours={ !showHours }
        padHoursWithZero={ true }
        minuteInterval={ minutesInterval }
      />
    </View>
  );
};

export default CustomTimePicker;
