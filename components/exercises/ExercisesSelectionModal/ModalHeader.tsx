import { Text } from "react-native";

interface ModalHeaderProps {
  selectedCount: number;
}

export function ModalHeader({ selectedCount }: ModalHeaderProps) {
  return (
    <>
      <Text className='text-center text-primary font-calsans text-2xl'>
        Choisis tes exercices
      </Text>

      <Text className='text-center text-primary-100 font-sregular mb-4'>
        {selectedCount} exercice{selectedCount > 1 ? "s" : ""} sélectionné{selectedCount > 1 ? "s" : ""}
      </Text>
    </>
  );
}