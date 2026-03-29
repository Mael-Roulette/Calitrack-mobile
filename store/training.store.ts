import { getUserTrainings } from "@/lib/training.appwrite";
import { Training } from "@/types";
import { create } from "zustand";
import { useAuthStore } from ".";

interface TrainingStoreProps {
  trainings: Training[];
  isLoading: boolean;
  error: string | null;
  isLoadingByWeek: boolean;

  setTrainings: ( trainings: Training[] ) => void;
  setIsLoading: ( isLoading: boolean ) => void;
  setError: ( error: string | null ) => void;
  setIsLoadingByWeek: ( isLoading: boolean ) => void;

  fetchUserTrainings: () => Promise<void>;
  getTrainingsByWeek: ( weekId: string ) => Promise<Training[]>;
  getTrainingsByWeekCached: ( weekId: string ) => Training[];
}

const useTrainingsStore = create<TrainingStoreProps>( ( set, get ) => ( {
  trainings: [],
  isLoading: false,
  error: null,
  isLoadingByWeek: false,

  setTrainings: ( trainings ) => set( { trainings, error: null } ),
  setIsLoading: ( isLoading ) => set( { isLoading } ),
  setError: ( error ) => set( { error } ),
  setIsLoadingByWeek: ( isLoading ) => set( { isLoadingByWeek: isLoading } ),

  fetchUserTrainings: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    const state = get();

    if ( !isAuthenticated ) {
      set( { error: "Utilisateur non authentifié" } );
      return;
    }

    if ( state.isLoading ) return;

    set( { isLoading: true, error: null } );

    try {
      const trainings = await getUserTrainings() as unknown as Training[];
      set( { trainings: trainings || [], error: null } );
    } catch ( error ) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des entraînements";

      console.error( "Erreur fetchUserTrainings:", error );
      set( { trainings: [], error: errorMessage, isLoading: false } );
    } finally {
      set( { isLoading: false } );
    }
  },

  // retourne directement les données du store
  getTrainingsByWeekCached: ( weekId ) => {
    const { trainings } = get();
    return trainings.filter( ( t ) => t.week === weekId );
  },

  // Version async : charge les données si nécessaire
  getTrainingsByWeek: async ( weekId ) => {
    const { trainings, isLoadingByWeek } = get();

    // Si déjà en cours de chargement, on attend (ou on retourne les données existantes)
    if ( isLoadingByWeek ) {
      // Pour simplifier, on retourne directement les données existantes
      return trainings.filter( ( t ) => t.week === weekId );
    }

    // Si les données sont déjà présentes, on filtre directement
    if ( trainings.length > 0 ) {
      return trainings.filter( ( t ) => t.week === weekId );
    }

    // Sinon, on charge toutes les données
    set( { isLoadingByWeek: true, error: null } );

    try {
      const allTrainings = await getUserTrainings() as unknown as Training[];
      set( { trainings: allTrainings || [], isLoadingByWeek: false } );

      return allTrainings?.filter( ( t ) => t.week === weekId ) || [];
    } catch ( error ) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des entraînements";

      console.error( "Erreur getTrainingsByWeek:", error );
      set( { error: errorMessage, isLoadingByWeek: false } );
      throw new Error( errorMessage );
    }
  },
} ) );

export default useTrainingsStore;
