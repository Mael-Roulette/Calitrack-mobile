import { EXERCISES_TYPES } from "@/constants/exercises";
import { Category, Exercise } from "@/types";
import { toggleExerciseSelection } from "@/utils/selection";
import React, { useCallback, useEffect, useState } from "react";
import { Animated, Modal, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useModalAnimation } from "../../../hooks/exercise/useModalAnimation";
import { ModalActions } from "./ModalActions";
import { CategoryBackHeader } from "./ModalCategoryBackHeader";
import { CategoryList } from "./ModalCategoryList";
import { ModalCustomExercises } from "./ModalCustomExercises";
import { ModalDragHandle } from "./ModalDragHandle";
import { ModalHeader } from "./ModalHeader";
import { TypeExercises } from "./ModalTypeExercises";

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
  const [ selectedExercises, setSelectedExercises ] = useState<Exercise[]>( initialSelectedExercises );
  const [ category, setCategory ] = useState<Category | null>( null );

  const { panY, panResponder, closeModal } = useModalAnimation( isVisible, onClose );

  useEffect( () => {
    if ( isVisible ) {
      setCategory( null );
      setSelectedExercises( initialSelectedExercises );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isVisible ] );

  const handleExerciseToggle = useCallback( ( exercise: Exercise ) => {
    setSelectedExercises( ( prev ) =>
      toggleExerciseSelection( prev, exercise, selectableExercise )
    );
  }, [ selectableExercise ] );

  const isExerciseSelected = useCallback(
    ( exerciseId: string ) => selectedExercises.some( ( ex ) => ex.$id === exerciseId ),
    [ selectedExercises ]
  );

  const handleConfirmSelection = useCallback( () => {
    setTimeout( () => {
      onExerciseSelected?.( selectedExercises );
      closeModal();
    }, 0 );
  }, [ selectedExercises, onExerciseSelected, closeModal ] );

  if ( !isVisible ) return null;

  const categoryLabel =
    category === "custom"
      ? "Personnalisés"
      : EXERCISES_TYPES.find( ( t ) => t.type === category )?.label;

  const selectionProps = {
    isSelected: isExerciseSelected,
    onToggle: handleExerciseToggle,
  };

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

                { category === null ? (
                  <CategoryList onSelect={ setCategory } />
                ) : (
                  <View className='flex-1'>
                    <CategoryBackHeader
                      label={ categoryLabel }
                      onBack={ () => setCategory( null ) }
                    />
                    { category === "custom" ? (
                      <ModalCustomExercises { ...selectionProps } />
                    ) : (
                      <TypeExercises type={ category } { ...selectionProps } />
                    ) }
                  </View>
                ) }

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