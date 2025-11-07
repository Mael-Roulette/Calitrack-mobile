import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { TimerPickerModal } from "react-native-timer-picker";

interface TimePickerProps {
  label: string;
  value: number;
  showHours?: boolean;
  onChange: ( duration: number ) => void;
}

const CustomTimePicker = ( { label, value, showHours = true, onChange }: TimePickerProps ) => {
  const [ visible, setVisible ] = useState( false );

  const formatDuration = ( totalMinutes: number ) => {
    const h = Math.floor( totalMinutes / 60 ).toString().padStart( 2, "0" );
    const m = ( totalMinutes % 60 ).toString().padStart( 2, "0" );
    return `${h}:${m}`;
  };

  return (
    <View className="w-full">
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
        onConfirm={ ( { hours = 0, minutes = 0 } ) => {
          const total = hours * 60 + minutes;
          onChange( total );
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
          container: {
            flex: 1,
            justifyContent: "center",
            paddingBottom: 0,
            height: "100%"
          },
          contentContainer: {
            width: "100%",
            height: "auto"
          },
          text: {
            fontSize: 20
          }
        } }
        hideSeconds={ true }
        hideHours={ !showHours }
      />
    </View>
  );
};

export default CustomTimePicker;
