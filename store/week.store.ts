import { getUserWeeks } from "@/lib/week.appwrite";
import { Week } from "@/types";
import { create } from "zustand";
import useAuthStore from "./auth.store";

interface WeekStoreProps {
 	weeks: Week[];
 	isLoading: boolean;
  error: string | null;

  // Actions de base
  setWeeks: ( weeks: Week[] ) => void;
  setIsLoading: ( isLoading: boolean ) => void;
  setError: ( error: string | null ) => void;

  // Actions CRUD
  fetchUserWeeks: () => Promise<void>;
 	addWeekStore: ( week: Week ) => Promise<void>;
 	updateWeekStore: ( week: Week, { name, order }: { name: string, order: number } ) => Promise<void>;
 	deleteWeekStore: ( weekid: string ) => Promise<void>;
}

const useWeeksStore = create<WeekStoreProps>( ( set, get ) => ( {
  weeks: [],
  isLoading: false,
  error: null,

  // Setters
  setWeeks: ( weeks: Week[] ) => set( { weeks, error: null } ),
  setIsLoading: ( isLoading: boolean ) => set( { isLoading } ),
  setError: ( error: string | null ) => set( { error } ),

  // Récupération initiale des semaines
  fetchUserWeeks: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    const state = get();

    if ( !isAuthenticated ) {
      set( { error: "Utilisateur non authentifié" } );
      return;
    }

    if ( state.isLoading ) return; // Bloquer seulement pendant le chargement

    set( { isLoading: true, error: null } );

    try {
      const weeks = await getUserWeeks() as unknown as Week[];
      set( {
        weeks: weeks || [],
        error: null
      } );
    } catch ( error ) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des semaines";

      console.error( "Erreur fetchUserWeeks:", error );
      set( {
        weeks: [],
        error: errorMessage,
        isLoading: false
      } );
    } finally {
      set( { isLoading: false } );
    }
  },

  addWeekStore: async ( week: Week ) => {
    set( ( state ) => ( {
      weeks: [ ...state.weeks, week ],
      error: null
    } ) );
  },

  updateWeekStore: async () => { },

  deleteWeekStore: async ( weekId: string ) => {
    set( ( state ) => ( {
      weeks: state.weeks.filter( ( week ) => week.$id !== weekId ),
      error: null
    } ) );
  }
} ) );

export default useWeeksStore;
