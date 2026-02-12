import CustomInput from "@/components/ui/CustomInput";
import { useExercicesStore } from "@/store";
import { Exercise } from "@/types";
import { toggleExerciseSelection } from "@/utils/selection";
import React, { useCallback, useState } from "react";
import {
  Animated,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExerciseSelectionItem from "../ExerciseSelectionItem";
import { ModalActions } from "./ModalActions";
import { ModalDragHandle } from "./ModalDragHandle";
import { ModalHeader } from "./ModalHeader";
import { useExerciseSearch } from "./useExerciseSearch";
import { useModalAnimation } from "./useModalAnimation";

interface ExerciseSelectionModalProps {
  isVisible: boolean;
  onClose: () => void;
  onExerciseSelected?: ( exercises: Exercise[] ) => void;
  initialSelectedExercises?: Exercise[];
  selectableExercise?: number;
}

export default function ExercisesSelectionModal ( {
  isVisible,
  onClose,
  onExerciseSelected,
  initialSelectedExercises = [],
  selectableExercise,
}: ExerciseSelectionModalProps ) {
  const { exercices } = useExercicesStore();
  const [ selectedExercises, setSelectedExercises ] = useState<Exercise[]>( initialSelectedExercises );

  const { filteredExercises, handleSearch } = useExerciseSearch( exercices );
  const { panY, panResponder, closeModal } = useModalAnimation( isVisible, onClose );

  const handleExerciseToggle = useCallback( ( exercise: Exercise ) => {
    setSelectedExercises( ( prev ) =>
      toggleExerciseSelection( prev, exercise, selectableExercise )
    );
  }, [ selectableExercise ] );

  const isExerciseSelected = useCallback(
    ( exerciseId: string ) => {
      return selectedExercises.some( ( ex ) => ex.$id === exerciseId );
    },
    [ selectedExercises ]
  );

  const handleConfirmSelection = useCallback( () => {
    setTimeout( () => {
      if ( onExerciseSelected ) {
        onExerciseSelected( selectedExercises );
      }
      closeModal();
    }, 0 );
  }, [ selectedExercises, onExerciseSelected, closeModal ] );

  if ( !isVisible ) return null;

  return (
    <Modal
      statusBarTranslucent
      animationType='slide'
      transparent
      visible={ isVisible }
      onRequestClose={ closeModal }
    >
      <TouchableWithoutFeedback onPress={ closeModal }>
        <SafeAreaView className='flex-1 bg-black/40 justify-end' edges={ [ "bottom" ] }>
          <TouchableWithoutFeedback onPress={ ( e ) => e.stopPropagation() }>
            <Animated.View
              style={ {
                transform: [ { translateY: panY } ],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -10 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 10,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              } }
              className='bg-background p-5 h-4/5 w-full'
            >
              <View { ...panResponder.panHandlers }>
                <ModalDragHandle />
              </View>

              <View className='flex-1'>
                <ModalHeader selectedCount={ selectedExercises.length } />

                <CustomInput
                  label='Rechercher un exercice'
                  placeholder='Ex : Front, planche, ...'
                  onChangeText={ handleSearch }
                  customStyles='mb-4'
                />

                <FlatList
                  className='flex-1 mb-4'
                  data={ filteredExercises }
                  showsVerticalScrollIndicator={ false }
                  keyExtractor={ ( item ) => item.$id }
                  renderItem={ ( { item } ) => (
                    <ExerciseSelectionItem
                      image={ item.image }
                      name={ item.name }
                      difficulty={ item.difficulty }
                      selectable
                      isSelected={ isExerciseSelected( item.$id ) }
                      onPress={ () => handleExerciseToggle( item ) }
                    />
                  ) }
                />

                <ModalActions
                  selectedCount={ selectedExercises.length }
                  onCancel={ closeModal }
                  onConfirm={ handleConfirmSelection }
                />
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}