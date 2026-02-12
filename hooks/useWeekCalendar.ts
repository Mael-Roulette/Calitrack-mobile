import { getWeekDays } from "@/utils/date";
import { useMemo } from "react";

export function useWeekCalendar () {
  const currentDay = new Date().getDate();
  const days = useMemo( () => getWeekDays(), [] );

  return { days, currentDay };
}