import { useCallback, useEffect, useRef } from "react";
import { Animated, PanResponder } from "react-native";

export function useModalAnimation ( isVisible: boolean, onClose: () => void ) {
  const panY = useRef( new Animated.Value( 0 ) ).current;

  const resetPositionAnim = Animated.timing( panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  } );

  const closeModal = useCallback( () => {
    onClose();
  }, [ onClose ] );

  const panResponder = useRef(
    PanResponder.create( {
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: ( e, gestureState ) => {
        if ( gestureState.dy > 0 ) {
          panY.setValue( gestureState.dy );
        }
      },
      onPanResponderRelease: ( e, gestureState ) => {
        if ( gestureState.dy > 200 ) {
          closeModal();
        } else {
          resetPositionAnim.start();
        }
      },
    } )
  ).current;

  useEffect( () => {
    if ( isVisible ) {
      panY.setValue( 0 );
      resetPositionAnim.start();
    }
  }, [ isVisible, panY, resetPositionAnim ] );

  return { panY, panResponder, closeModal };
}