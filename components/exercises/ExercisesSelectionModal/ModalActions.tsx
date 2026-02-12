import CustomButton from "@/components/ui/CustomButton";
import { View } from "react-native";

interface ModalActionsProps {
  selectedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ModalActions ( { selectedCount, onCancel, onConfirm }: ModalActionsProps ) {
  return (
    <View className='flex-row gap-3'>
      <CustomButton
        title='Annuler'
        variant='secondary'
        onPress={ onCancel }
        customStyles="flex-1"
      />
      <CustomButton
        title={ `Confirmer (${selectedCount})` }
        onPress={ onConfirm }
        customStyles="flex-1"
      />
    </View>
  );
}