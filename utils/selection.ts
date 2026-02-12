import { Exercise } from "@/types";

export function toggleExerciseSelection (
  currentSelection: Exercise[],
  exercise: Exercise,
  maxSelectable?: number
): Exercise[] {
  const isAlreadySelected = currentSelection.some( ( ex ) => ex.$id === exercise.$id );

  if ( isAlreadySelected ) {
    return currentSelection.filter( ( ex ) => ex.$id !== exercise.$id );
  }

  if ( maxSelectable && currentSelection.length >= maxSelectable ) {
    return [ ...currentSelection.slice( 1 ), exercise ];
  }

  return [ ...currentSelection, exercise ];
}