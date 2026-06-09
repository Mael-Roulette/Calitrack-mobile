import { DAY_INDEX_MAP } from "@/constants/date";
import useTrainingsStore from "@/store/training.store";
import useWeeksStore from "@/store/week.store";
import { Training } from "@/types";
import { useMemo } from "react";

function getCurrentWeekIndexInMonth (): number {
  const today = new Date();
  const firstOfMonth = new Date( today.getFullYear(), today.getMonth(), 1 );
  const firstDay = firstOfMonth.getDay();
  const offset = firstDay === 0 ? -6 : 1 - firstDay;
  const firstMonday = new Date( firstOfMonth );
  firstMonday.setDate( 1 + offset );

  const diffMs = today.getTime() - firstMonday.getTime();
  return Math.floor( diffMs / ( 7 * 24 * 60 * 60 * 1000 ) );
}

export function useTodayTraining (): Training | null {
  const { trainings } = useTrainingsStore();
  const { weeks } = useWeeksStore();

  return useMemo( () => {
    if ( !weeks.length ) return null;

    const sorted = [ ...weeks ].sort( ( a, b ) => a.order - b.order );
    const rotatedIndex = getCurrentWeekIndexInMonth() % sorted.length;
    const currentWeek = sorted[ rotatedIndex ];

    const todayKey = DAY_INDEX_MAP[ new Date().getDay() ];

    return (
      trainings
        .filter( ( t ) => t.week === currentWeek.$id )
        .find( ( t ) => t.days?.includes( todayKey ) ) ?? null
    );
  }, [ trainings, weeks ] );
}