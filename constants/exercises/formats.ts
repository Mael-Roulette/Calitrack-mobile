import { ExerciseFormat } from "@/types";

export const EXERCISE_FORMAT_OPTIONS = [
  { label: "Hold", value: ExerciseFormat.HOLD },
  { label: "Répétition", value: ExerciseFormat.REPETITION },
] as const;