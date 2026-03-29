/**
 * Formate des minutes
 * @param duration nombre de secondes à formater
 * @returns retourne l'heure au format 1h10 ou 40
 */
export const formatDuration = (
  duration: number
): string => {
  const durationInMinutes = duration / 60 ;

  if ( durationInMinutes < 60 ) {
    return `${durationInMinutes}`;
  }

  const hours = Math.floor( durationInMinutes / 60 );
  const minutes = durationInMinutes % 60;

  return minutes === 0
    ? `${hours}h`
    : `${hours}h${minutes.toString().padStart( 2, "0" )}`;
};
