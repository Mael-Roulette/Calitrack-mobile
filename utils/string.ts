/**
 * Formate des minutes
 * @param duration nombre de minutes à formater
 * @returns retourne l'heure au format 1h10 ou 40
 */
export const formatDuration = (
  duration: number
): string => {
  if ( duration < 60 ) {
    return `${duration}`;
  }

  const hours = Math.floor( duration / 60 );
  const minutes = duration % 60;

  return minutes === 0
    ? `${hours}h`
    : `${hours}h${minutes.toString().padStart( 2, "0" )}`;
};
