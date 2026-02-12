export const DIFFICULTY_CONFIG = {
  beginner: { label: "Débutant", color: "#3b82f6", tailwind: "text-blue-500" },
  novice: { label: "Novice", color: "#22c55e", tailwind: "text-green-500" },
  intermediate: { label: "Intermédiaire", color: "#eab308", tailwind: "text-yellow-500" },
  advanced: { label: "Avancé", color: "#f97316", tailwind: "text-orange-500" },
  expert: { label: "Expert", color: "#ef4444", tailwind: "text-red-500" },
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_CONFIG;

export function getDifficultyInfo ( difficulty: string ) {
  return DIFFICULTY_CONFIG[ difficulty as DifficultyLevel ] ?? DIFFICULTY_CONFIG.novice;
}