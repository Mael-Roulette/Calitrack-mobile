import { useReducer } from "react";

export type ActiveState = "series" | "rest";

export interface Progress {
  seriesIndex: number;
  set: number;
  activeState: ActiveState;
}

export const initialProgress: Progress = {
  seriesIndex: 0,
  set: 1,
  activeState: "series",
};

type Action =
  | { type: "RESET" }
  | { type: "SET_DONE" }
  | { type: "REST_DONE"; sets: number }
  | { type: "RESTORE"; payload: Progress };

function reducer ( s: Progress, a: Action ): Progress {
  switch ( a.type ) {
    case "RESET":
      return initialProgress;

    case "SET_DONE":
      return { ...s, activeState: "rest" };

    case "REST_DONE":
      return s.set >= a.sets
        ? { seriesIndex: s.seriesIndex + 1, set: 1, activeState: "series" }
        : { ...s, set: s.set + 1, activeState: "series" };

    case "RESTORE":
      return a.payload;
  }
}

export function useSessionProgress () {
  return useReducer( reducer, initialProgress );
}