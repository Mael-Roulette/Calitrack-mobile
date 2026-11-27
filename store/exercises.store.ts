import { EXERCISES_PAGE_SIZE, getCustomExercises, getExercisesByType } from "@/lib/exercise.appwrite";
import { Exercise, ExerciseType } from "@/types";
import { createGlobal as create } from "./index.store";

interface TypeState {
  items: Exercise[];
  cursor?: string;
  hasMore: boolean;
  isLoaded: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
}

export type ExerciseKey = ExerciseType | "custom";

const initialTypeState: TypeState = {
  items: [],
  cursor: undefined,
  hasMore: true,
  isLoaded: false,
  isLoading: false,
  isLoadingMore: false,
  error: null,
};

interface ExercisesStoreProps {
  byType: Partial<Record<ExerciseKey, TypeState>>;

  // Actions
  fetchByType: ( type: ExerciseKey ) => Promise<void>;
  loadMore: ( type: ExerciseKey ) => Promise<void>;
  refresh: ( type: ExerciseKey ) => Promise<void>;

  addExercise: ( exercise: Exercise ) => void;
  removeExercise: ( exerciseId: string ) => void;
  updateExercise: ( exerciseId: string, updates: Partial<Exercise> ) => void;
  reset: () => void;
}

const useExercicesStore = create<ExercisesStoreProps>( ( set, get ) => {
  const patch = ( key: ExerciseKey, partial: Partial<TypeState> ) =>
    set( ( state ) => ( {
      byType: {
        ...state.byType,
        [ key ]: { ...( state.byType[ key ] ?? initialTypeState ), ...partial },
      },
    } ) );

  const loadPage = async ( key: ExerciseKey, reset: boolean ) => {
    const current = get().byType[ key ] ?? initialTypeState;

    patch( key, reset
      ? { isLoading: true, error: null }
      : { isLoadingMore: true, error: null }
    );

    try {
      if ( key === "custom" ) {
        const rows = await getCustomExercises();
        patch( key, {
          items: rows as unknown as Exercise[],
          hasMore: false,
          isLoaded: true,
          isLoading: false,
        } );
        return;
      }

      const rows = await getExercisesByType( key, reset ? undefined : current.cursor );
      const exercises = rows as unknown as Exercise[];

      patch( key, {
        items: reset ? exercises : [ ...current.items, ...exercises ],
        cursor: exercises.length > 0 ? exercises[ exercises.length - 1 ].$id : current.cursor,
        hasMore: exercises.length === EXERCISES_PAGE_SIZE,
        isLoaded: true,
        isLoading: false,
        isLoadingMore: false,
      } );
    } catch ( error ) {
      patch( key, {
        error: error instanceof Error ? error.message : "Erreur inconnue",
        isLoading: false,
        isLoadingMore: false,
      } );
    }
  };

  return {
    byType: {},

    fetchByType: async ( type ) => {
      const s = get().byType[ type ];
      if ( s?.isLoaded || s?.isLoading ) return;
      await loadPage( type, true );
    },

    loadMore: async ( type ) => {
      const s = get().byType[ type ];
      if ( !s || !s.hasMore || s.isLoading || s.isLoadingMore ) return;
      await loadPage( type, false );
    },

    refresh: async ( type ) => {
      await loadPage( type, true );
    },

    addExercise: ( exercise ) => {
      const key: ExerciseKey = exercise.isCustom ? "custom" : exercise.type;
      set( ( state ) => {
        const s = state.byType[ key ] ?? initialTypeState;
        return {
          byType: { ...state.byType, [ key ]: { ...s, items: [ exercise, ...s.items ] } },
        };
      } );
    },

    removeExercise: ( exerciseId ) => {
      set( ( state ) => {
        const next = { ...state.byType };
        for ( const key of Object.keys( next ) as ExerciseType[] ) {
          const s = next[ key ]!;
          next[ key ] = { ...s, items: s.items.filter( ex => ex.$id !== exerciseId ) };
        }
        return { byType: next };
      } );
    },

    updateExercise: ( exerciseId, updates ) => {
      set( ( state ) => {
        const next = { ...state.byType };
        for ( const key of Object.keys( next ) as ExerciseType[] ) {
          const s = next[ key ]!;
          next[ key ] = {
            ...s,
            items: s.items.map( ex => ex.$id === exerciseId ? { ...ex, ...updates } : ex ),
          };
        }
        return { byType: next };
      } );
    },

    reset: () => set( { byType: {} } ),
  };
} );

export default useExercicesStore;