import { Exercise } from "@/types";
import { useMemo, useState } from "react";

type FilterTab = "all" | "custom";

export function useExerciseFilters ( exercises: Exercise[] ) {
  const [ activeTab, setActiveTab ] = useState<FilterTab>( "all" );

  const filteredExercises = useMemo( () => {
    return activeTab === "all"
      ? exercises.filter( ex => !ex.isCustom )
      : exercises.filter( ex => ex.isCustom );
  }, [ exercises, activeTab ] );

  return {
    activeTab,
    setActiveTab,
    filteredExercises,
  };
}