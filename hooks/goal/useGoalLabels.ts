import { GOAL_LABEL_CONFIGS } from "@/constants/goals";
import { Exercise } from "@/types";
import { useMemo } from "react";

export function useGoalLabels ( exercise?: Exercise ) {
  return useMemo( () => {
    if ( !exercise?.format ) return GOAL_LABEL_CONFIGS.default;
    return GOAL_LABEL_CONFIGS[ exercise.format ] ?? GOAL_LABEL_CONFIGS.default;
  }, [ exercise?.format ] );
}
