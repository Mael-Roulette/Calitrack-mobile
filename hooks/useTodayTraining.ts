import useTrainingsStore from "@/store/training.store";
import { Training } from "@/types";
import { useMemo } from "react";

const DAY_INDEX_MAP: Record<number, string> = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
};

export function useTodayTraining (): Training | null {
  const { trainings } = useTrainingsStore();

  return useMemo( () => {
    const todayKey = DAY_INDEX_MAP[ new Date().getDay() ];

    return (
      trainings.find( ( t ) => t.days?.includes( todayKey ) ) ?? null
    );
  }, [ trainings ] );
}