import { Feather } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export type ActionMenuItem = {
  icon: keyof typeof Feather.glyphMap;
  text: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  showBorder?: boolean;
};

interface ActionsMenuProps {
  visible: boolean;
  onClose: () => void;
  items: ActionMenuItem[];
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

export default function ActionsMenu ( {
  visible,
  onClose,
  items,
  position = { top: 64, right: 56 }
}: ActionsMenuProps ) {
  const handleItemPress = ( onPress: () => void ) => {
    onPress();
    onClose();
  };

  return (
    <Modal
      transparent={ true }
      visible={ visible }
      animationType='fade'
      onRequestClose={ onClose }
      statusBarTranslucent
    >
      <TouchableOpacity
        style={ { flex: 1 } }
        activeOpacity={ 1 }
        onPress={ onClose }
      >
        <View
          className='absolute bg-background rounded-md shadow-lg elevation-md min-w-40'
          style={ position }
        >
          { items.map( ( item, index ) => (
            <TouchableOpacity
              key={ index }
              onPress={ () => handleItemPress( item.onPress ) }
              className={ `flex-row items-center px-4 py-3 ${
                item.showBorder !== false && index < items.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }` }
            >
              <Feather
                name={ item.icon }
                size={ 18 }
                color={ item.color || "#132541" }
              />
              <Text
                className={ `ml-3 text-base font-sregular ${
                  item.textColor
                    ? `text-[${ item.textColor }]`
                    : "text-primary"
                }` }
                style={ item.textColor ? { color: item.textColor } : undefined }
              >
                { item.text }
              </Text>
            </TouchableOpacity>
          ) ) }
        </View>
      </TouchableOpacity>
    </Modal>
  );
}