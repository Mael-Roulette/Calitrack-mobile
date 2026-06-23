import { STORAGE_KEYS } from "@/constants/storageKeys";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface RestTimerState {
  // Timestamp (ms) auquel le repos doit se terminer
  endTime: number;
}

/**
 * Sauvegarde l'heure de fin du repos en cours.
 * Permet de recalculer le temps restant même si l'app
 * a été suspendue (écran éteint, app en arrière-plan).
 */
export const saveRestTimerState = async ( endTime: number ): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.REST_TIMER_STATE,
      JSON.stringify( { endTime } as RestTimerState )
    );
  } catch ( error ) {
    console.error( "Erreur lors de la sauvegarde du timer de repos:", error );
  }
};

/**
 * Récupère l'état du timer de repos en cours, s'il existe.
 * @returns {Promise<RestTimerState | null>} - null si aucun repos n'est en cours
 */
export const getRestTimerState = async (): Promise<RestTimerState | null> => {
  try {
    const raw = await AsyncStorage.getItem( STORAGE_KEYS.REST_TIMER_STATE );
    if ( !raw ) return null;
    return JSON.parse( raw ) as RestTimerState;
  } catch ( error ) {
    console.error( "Erreur lors de la lecture du timer de repos:", error );
    return null;
  }
};

/**
 * Efface l'état du timer de repos (repos terminé, passé, ou annulé).
 */
export const clearRestTimerState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem( STORAGE_KEYS.REST_TIMER_STATE );
  } catch ( error ) {
    console.error( "Erreur lors de la suppression du timer de repos:", error );
  }
};

/**
 * Calcule le temps restant (en secondes, jamais négatif) à partir
 * d'un timestamp de fin.
 */
export const getRemainingSeconds = ( endTime: number ): number => {
  const remainingMs = endTime - Date.now();
  return Math.max( 0, Math.ceil( remainingMs / 1000 ) );
};