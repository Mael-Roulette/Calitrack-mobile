const exerciseImages = {
  "full-planche": require( "@/assets/images/exercises/full-planche.png" ),
  "straddle-planche": require( "@/assets/images/exercises/straddle-planche.jpg" ),
  "tuck-planche": require( "@/assets/images/exercises/tuck-planche.jpg" ),
  "adv-tuck-planche": require( "@/assets/images/exercises/adv-tuck-planche.jpg" ),
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