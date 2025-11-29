// Composant RPESelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface RPESelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const RpeSelector: React.FC<RPESelectorProps> = ({ value, onChange }) => {
  const rpeValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <View className="border border-primary-100 rounded-md p-2 flex-row flex-wrap">
      {rpeValues.map((rpe) => (
        <TouchableOpacity
          key={rpe}
          className={`py-2 px-3 rounded items-center justify-center ${
            value === rpe ? 'bg-orange-500' : ''
          }`}
          onPress={() => onChange(rpe)}
          activeOpacity={0.7}
        >
          <Text
            className={`text-base font-semibold ${
              value === rpe ? 'text-white' : 'text-black'
            }`}
          >
            {rpe}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RpeSelector;