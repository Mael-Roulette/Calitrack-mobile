import { formatSecondsDuration } from "@/utils/string";
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
  customStyles?: string;
}

const CustomTimePicker = ( { label, value, showSeconds = true, showHours = true, minutesInterval = 1, onChange, customStyles }: TimePickerProps ) => {
  const [ visible, setVisible ] = useState( false );

  return (
    <View>
      { !!label && (
        <Text className="label-text mb-2">{ label }</Text>
      ) }

      <Pressable
        onPress={ () => setVisible( true ) }
        className={ `custom-input py-3 ${customStyles}` }
      >
        <Text className="text-lg text-primary">
          { formatSecondsDuration( value ) }
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
