import React, { useState } from "react";
import {
  Modal,
  TouchableOpacity,
  View,
  Text,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Option = {
  label: string;
  value: string;
};

type CustomSelectProps = {
  options: Option[];
  value: string | null;
  onChange: ( value: string ) => void;
  placeholder?: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ( {
  options,
  value,
  onChange,
  placeholder = "Choisir...",
} ) => {
  const [ visible, setVisible ] = useState( false );

  const selectedLabel = options.find( ( option ) => option.value === value )?.label;

  return (
    <View>
      {/* Zone cliquable */ }
      <TouchableOpacity
        className="custom-input flex-row items-center justify-between pr-4"
        onPress={ () => setVisible( true ) }
      >
        <Text
          className={ `${value ? "text-primary" : "text-primary-50"} text-lg font-sregular` }
        >
          { value ? selectedLabel : placeholder }
        </Text>


        <Ionicons
          name={ visible ? "chevron-up" : "chevron-down" }
          size={ 20 }
          color="#132541"
        />
      </TouchableOpacity>

      {/* Modal avec la liste */ }
      <Modal visible={ visible } transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center items-center"
          activeOpacity={ 1 }
          onPressOut={ () => setVisible( false ) }
        >
          <View className="bg-white rounded-md w-4/5 max-h-1/2 py-2">
            <FlatList
              data={ options }
              keyExtractor={ ( item ) => item.value }
              renderItem={ ( { item } ) => (
                <TouchableOpacity
                  className="px-4 py-3"
                  onPress={ () => {
                    onChange( item.value );
                    setVisible( false );
                  } }
                >
                  <Text className="custom-option">{ item.label }</Text>
                </TouchableOpacity>
              ) }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default CustomSelect;
