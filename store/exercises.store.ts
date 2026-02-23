import { getAllExercises } from "@/lib/exercise.appwrite";
import { Exercise } from "@/types";
import { create } from "zustand";

interface ExercisesStoreProps {
	exercices: Exercise[];
	isLoading: boolean;
	error: string | null;

	// Actions
	fetchExercises: () => Promise<void>;
	addExercise: ( exercise: Exercise ) => void;
	removeExercise: ( exerciseId: string ) => void;
	updateExercise: ( exerciseId: string, updates: Partial<Exercise> ) => void;
	setExercises: ( exercises: Exercise[] ) => void;
}

const useExercicesStore = create<ExercisesStoreProps>( ( set ) => ( {
  exercices: [],
  isLoading: false,
  error: null,

  fetchExercises: async () => {
    set( { isLoading: true, error: null } );
    try {
      const exercises = await getAllExercises();
      set( { exercices: exercises as any as Exercise[], isLoading: false } );
    } catch ( error ) {
      set( {
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false
      } );
    }
  },

  addExercise: ( exercise ) => {
    set( ( state ) => ( {
      exercices: [ ...state.exercices, exercise ]
    } ) );
  },

  removeExercise: ( exerciseId ) => {
    set( ( state ) => ( {
      exercices: state.exercices.filter( ex => ex.$id !== exerciseId )
    } ) );
  },

  updateExercise: ( exerciseId, updates ) => {
    set( ( state ) => ( {
      exercices: state.exercices.map( ex =>
        ex.$id === exerciseId ? { ...ex, ...updates } : ex
      )
    } ) );
  },

  setExercises: ( exercises ) => {
    set( { exercices: exercises } );
  },
} ) );

export default useExercicesStore;
