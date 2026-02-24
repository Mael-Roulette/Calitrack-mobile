import { getUserWeeks } from "@/lib/week.appwrite";
import { Week } from "@/types";
import { create } from "zustand";
import useAuthStore from "./auth.store";

interface WeekStoreProps {
  weeks: Week[];
  isLoading: boolean;
  error: string | null;

  setWeeks: ( weeks: Week[] ) => void;
  setIsLoading: ( isLoading: boolean ) => void;
  setError: ( error: string | null ) => void;

  fetchUserWeeks: () => Promise<void>;
  addWeekStore: ( week: Week ) => Promise<void>;
  updateWeekStore: ( params: {
    weekId: string;
    name: string;
    newOrder: number;
    swappedWeekId: string | null;
    oldOrder: number;
  } ) => void;
  deleteWeekStore: ( weekId: string ) => Promise<void>;

  getWeekById: ( weekId: string ) => Week | undefined;
}

const useWeeksStore = create<WeekStoreProps>( ( set, get ) => ( {
  weeks: [],
  isLoading: false,
  error: null,

  setWeeks: ( weeks ) => set( { weeks, error: null } ),
  setIsLoading: ( isLoading ) => set( { isLoading } ),
  setError: ( error ) => set( { error } ),

  fetchUserWeeks: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    const state = get();

    if ( !isAuthenticated ) {
      set( { error: "Utilisateur non authentifié" } );
      return;
    }

    if ( state.isLoading ) return;

    set( { isLoading: true, error: null } );

    try {
      const weeks = await getUserWeeks() as unknown as Week[];
      set( { weeks: weeks || [], error: null } );
    } catch ( error ) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des semaines";

      console.error( "Erreur fetchUserWeeks:", error );
      set( { weeks: [], error: errorMessage, isLoading: false } );
    } finally {
      set( { isLoading: false } );
    }
  },

  addWeekStore: async ( week ) => {
    set( ( state ) => ( {
      weeks: [ ...state.weeks, week ],
      error: null,
    } ) );
  },

  updateWeekStore: ( { weekId, name, newOrder, swappedWeekId, oldOrder } ) => {
    set( ( state ) => ( {
      weeks: state.weeks
        .map( ( w ) => {
          if ( w.$id === weekId ) return { ...w, name, order: newOrder };
          if ( swappedWeekId && w.$id === swappedWeekId ) return { ...w, order: oldOrder };
          return w;
        } )
        // Retrier par ordre pour que la liste reste cohérente
        .sort( ( a, b ) => ( a.order as number ) - ( b.order as number ) ),
      error: null,
    } ) );
  },

  deleteWeekStore: async ( weekId ) => {
    set( ( state ) => ( {
      weeks: state.weeks.filter( ( week ) => week.$id !== weekId ),
      error: null,
    } ) );
  },

  // Récupérer un objectif par son ID
  getWeekById: ( weekId: string ) => {
    return get().weeks.find( ( week ) => week.$id === weekId );
  },
} ) );

export default useWeeksStore;
