import { View } from "react-native";

export function ModalDragHandle () {
  return (
    <View className='flex justify-center items-center mb-3 h-4 w-full'>
      <View className='h-1 w-16 bg-primary-100 rounded-full' />
    </View>
  );
}