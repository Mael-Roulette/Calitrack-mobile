import { Exercise } from "@/types";
import { useEffect, useState } from "react";

export function useExerciseSearch ( exercises: Exercise[] ) {
  const [ filteredExercises, setFilteredExercises ] = useState<Exercise[]>( exercises );

  useEffect( () => {
    setFilteredExercises( exercises );
  }, [ exercises ] );

  const handleSearch = ( text: string ) => {
    if ( !text.trim() ) {
      setFilteredExercises( exercises );
      return;
    }

    const query = text.toLowerCase();
    const filtered = exercises.filter(
      ( exercise ) =>
        exercise.name?.toLowerCase().includes( query ) ||
        exercise.type?.toLowerCase().includes( query )
    );

    setFilteredExercises( filtered );
  };

  return { filteredExercises, handleSearch };
}