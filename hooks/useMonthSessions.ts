import useSessionsStore from "@/store/session.store";
import { getFirstDayOfMonth } from "@/utils/date";
import { useMemo } from "react";

export function useMonthlySessionStats () {
  const { sessions } = useSessionsStore();

  return useMemo( () => {
    const firstOfMonth = getFirstDayOfMonth();

    let count = 0;
    let totalSeconds = 0;

    for ( const s of sessions ) {
      if ( new Date( s.$createdAt ) < firstOfMonth ) continue;

      count++;
      totalSeconds += s.duration ?? 0;
    }

    return {
      count,
      totalSeconds,
    };
  }, [ sessions ] );
}