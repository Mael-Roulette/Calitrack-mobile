import { Series } from "@/types";
import SessionRest from "./SessionRest";
import SessionSeriesActive from "./SessionSeriesActive";
import { ActiveState } from "@/hooks/actions/session/useSessionProgress";

interface SessionActiveProps {
  series: Series;
  seriesNumber: number;
  totalSeries: number;
  currentSet: number;
  activeState: ActiveState;
  nextExercise: string;
  onSetComplete: ( achievedValue: number ) => void;
  onRestComplete: () => void;
}

export default function SessionActive ( {
  series,
  seriesNumber,
  totalSeries,
  currentSet,
  activeState,
  nextExercise,
  onSetComplete,
  onRestComplete,
}: SessionActiveProps ) {
  if ( activeState === "rest" ) {
    return (
      <SessionRest
        restTime={ series.restTime ?? 60 }
        nextExercise={ nextExercise }
        onRestComplete={ onRestComplete }
      />
    );
  }

  return (
    <SessionSeriesActive
      key={ `${series.$id}-${currentSet}` }
      series={ series }
      currentSet={ currentSet }
      totalSets={ series.sets }
      seriesNumber={ seriesNumber }
      totalSeries={ totalSeries }
      onSetComplete={ onSetComplete }
    />
  );
}