const exerciseImages = {
  'full-planche': require( '@/assets/images/exercises/full-planche.png' ),
};

export const getExerciseImage = ( imagePath ) => {
  return exerciseImages[ imagePath ];
};