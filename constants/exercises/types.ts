import { ExerciseType } from "@/types";

export const EXERCISE_TYPE_OPTIONS = [
  { label: "Pull", value: ExerciseType.PULL },
  { label: "Push", value: ExerciseType.PUSH },
] as const;

export const EXERCISES_TYPES: { type: ExerciseType; label: string; description: string }[] = [
  { type: ExerciseType.PUSH, label: "Push", description: "Planche et handstand variations" },
  { type: ExerciseType.PULL, label: "Pull", description: "Front lever variations" },
];