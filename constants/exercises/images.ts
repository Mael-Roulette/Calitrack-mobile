const exerciseImages = {
  "full-planche": require( "@/assets/images/exercises/full-planche.png" ),
} as const;

export type ExerciseImageKey = keyof typeof exerciseImages;

export const getExerciseImage = ( imagePath?: string ) => {
  if ( !imagePath || !( imagePath in exerciseImages ) ) {
    return null;
  }
  return exerciseImages[ imagePath as ExerciseImageKey ];
};

// Fonction utilitaire pour vérifier si l'image existe
export const hasExerciseImage = ( imagePath?: string ): imagePath is ExerciseImageKey => {
  return !!imagePath && imagePath in exerciseImages;
};