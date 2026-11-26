import { Exercise, GoalProgressHistory } from "@/types";
import { memo } from "react";
import { Modal, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import CustomButton from "../ui/CustomButton";
import CustomInput from "../ui/CustomInput";

interface UpdateGoalModalProps {
  modalVisible: boolean;
  setModalVisible: ( value: boolean ) => void;
  exercise: Exercise;
  progress: number;
  progressHistory: GoalProgressHistory[];
  newProgress: string;
  setNewProgress: ( value: string ) => void;
  handleUpdateProgress: () => void;
  isUpdating: boolean;
}

function UpdateGoalModal ( {
  modalVisible,
  setModalVisible,
  exercise,
  progress,
  progressHistory,
  newProgress,
  setNewProgress,
  handleUpdateProgress,
  isUpdating
}: UpdateGoalModalProps ) {

  const handleClose = () => {
    if ( !isUpdating ) {
      setModalVisible( false );
    }
  };

  const data = progressHistory.map( ( entry ) => ( {
    value: entry.progress,
    label: new Date( entry.date ).toLocaleDateString( "fr-FR", {
      day: "2-digit",
      month: "2-digit",
    } ),
  } ) );

  return (
    <Modal
      animationType='fade'
      transparent={ true }
      visible={ modalVisible }
      statusBarTranslucent={ true }
      onRequestClose={ handleClose }
    >
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-background w-[85%] p-6 rounded-xl'>
          <Text className='text-2xl font-calsans text-primary mb-2'>
            { exercise.name }
          </Text>

          <Text className='indicator-text text-lg mb-4'>
            Progression actuelle : { progress }
          </Text>

          { progressHistory.length > 1 && (
            <View className="py-8 overflow-hidden">
              <LineChart
                data={ data }
                color="#FC7942"
                dataPointsColor="#132541"
                thickness={ 3 }
                spacing={ 40 }
                endSpacing={ 20 }
                initialSpacing={ 15 }
                dataPointsRadius={ 4 }
                xAxisThickness={ 2 }
                xAxisLabelTextStyle={ { fontSize: 10 } }
                scrollToEnd
                scrollAnimation={ false }
              />
            </View>
          )}

          <CustomInput
            label='Nouvelle progression'
            value={ newProgress }
            placeholder={ `Ex: ${ progress + 1 }` }
            keyboardType='numeric'
            onChangeText={ setNewProgress }
          />

          <View className='flex-row gap-3 mt-6'>
            <CustomButton
              title='Annuler'
              onPress={ handleClose }
              isLoading={ isUpdating }
              variant='primary'
              customStyles="flex-1 w-full"
            />

            <CustomButton
              title='Mettre à jour'
              onPress={ handleUpdateProgress }
              variant='secondary'
              customStyles="flex-1 w-full"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// Mémoriser le composant
export default memo( UpdateGoalModal, ( prevProps, nextProps ) => {
  // Ne re-render que si les props essentielles ont changé
  return (
    prevProps.modalVisible === nextProps.modalVisible &&
    prevProps.newProgress === nextProps.newProgress &&
    prevProps.isUpdating === nextProps.isUpdating &&
    prevProps.progress === nextProps.progress
  );
} );