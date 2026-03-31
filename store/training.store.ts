import { getUserTrainings } from "@/lib/training.appwrite";
import { Training } from "@/types";
import { create } from "zustand";
import { useAuthStore } from ".";

interface TrainingStoreProps {
  trainings: Training[];
  currentTraining: Training | null;
  isLoading: boolean;
  error: string | null;

  setTrainings: ( trainings: Training[] ) => void;
  setIsLoading: ( isLoading: boolean ) => void;
  setError: ( error: string | null ) => void;

  fetchUserTrainings: () => Promise<void>;
  fetchTrainingById: ( trainingId: string ) => void;
  getTrainingsByWeekCached: ( weekId: string ) => Training[];
  addTrainingStore: ( training: Training ) => void;
  deleteTrainingStore: ( trainingId: string ) => void;
}

const useTrainingsStore = create<TrainingStoreProps>( ( set, get ) => ( {
  trainings: [],
  currentTraining: null,
  isLoading: false,
  error: null,

  setTrainings: ( trainings ) => set( { trainings, error: null } ),
  setIsLoading: ( isLoading ) => set( { isLoading } ),
  setError: ( error ) => set( { error } ),

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
      set( { trainings: [], error: errorMessage } );
    } finally {
      set( { isLoading: false } );
    }
  },

  fetchTrainingById: ( trainingId ) => {
    const { trainings } = get();
    const training = trainings.find( ( t ) => t.$id === trainingId ) ?? null;
    set( { currentTraining: training } );
  },

  getTrainingsByWeekCached: ( weekId ) => {
    const { trainings } = get();
    return trainings.filter( ( t ) => t.week === weekId );
  },

  // Ajouter un entrainement au store
  addTrainingStore: ( training: Training ) => {
    set( ( state ) => ( {
      trainings: [ training, ...state.trainings ],
      error: null
    } ) );
  },

  // Supprimer un entrainement
  deleteTrainingStore: ( trainingId: string ) => {
    set( ( state ) => ( {
      trainings: state.trainings.filter( ( training ) => training.$id !== trainingId ),
      error: null
    } ) );
  },
} ) );

export default useTrainingsStore;