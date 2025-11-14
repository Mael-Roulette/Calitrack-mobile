const exerciseImages = {
  'full-planche': require( '@/assets/images/exercises/full-planche.png' ),
};

export const getExerciseImage = ( imagePath ) => {
  return exerciseImages[ imagePath ];
};

export const exerciseDifficulty = [
  { label: "Débutant", value: "beginner" },
  { label: "Novice", value: "novice" },
  { label: "Intermédiaire", value: "intermediate" },
  { label: "Avancé", value: "advanced" },
  { label: "Expert", value: "expert" },
]

export const exerciseType = [
  { label: "Pull", value: "pull" },
  { label: "Push", value: "push" },
]

export const exerciseFormat = [
  { label: "Hold", value: "hold" },
  { label: "Répétition", value: "repetition" },
]