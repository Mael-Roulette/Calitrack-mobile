import { getExerciseById } from "@/lib/exercise.appwrite";
import { Goal } from "@/types";

export const buildGoalObject = async ( row: any ): Promise<Goal> => {
  const exerciseId =
    typeof row.exercise === "string"
      ? row.exercise
      : row.exercise?.$id;

  const exercise = await getExerciseById( exerciseId );

  return {
    $id: row.$id,
    $createdAt: row.$createdAt,
    $updatedAt: row.$updatedAt,
    exercise,
    progress: row.progress,
    total: row.targetValue, // adapte si nécessaire
    progressHistory: row.progressHistory ?? [],
    state: row.state,
  };
};