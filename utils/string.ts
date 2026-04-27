/**
 * Formate des minutes
 * @param duration nombre de secondes à formater
 * @returns retourne l'heure au format 1h10 ou 40
 */
export const formatMinutesDuration = (
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

export const formatSecondsDuration = ( totalSeconds: number,  showHours = true, showSeconds = true ) => {
  const h = Math.floor( totalSeconds / 3600 )
    .toString()
    .padStart( 2, "0" );

  const m = Math.floor( ( totalSeconds % 3600 ) / 60 )
    .toString()
    .padStart( 2, "0" );

  const s = Math.floor( totalSeconds % 60 )
    .toString()
    .padStart( 2, "0" );

  if ( showHours && showSeconds ) {
    return `${h}h${m}:${s}`;
  }

  if ( showHours && !showSeconds ) {
    return `${h}h${m}`;
  }

  if ( !showHours && showSeconds ) {
    return `${m}:${s}`;
  }

  return `${m}`;
};