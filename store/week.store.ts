import { User, Week } from "@/types";
import { create } from "zustand";
import useAuthStore from "./auth.store";
import { getUserWeeks } from "@/lib/week.appwrite";

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
 	createWeek: ( user: User, { name, order }: { name: string, order: number } ) => Promise<void>;
 	updateWeek: ( user: User, week: Week, { name, order }: { name: string, order: number } ) => Promise<void>;
 	deleteWeek: ( user: User, week: Week ) => Promise<void>;
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
        weeks,
        isLoading: true,
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

  createWeek: async () => { },

  updateWeek: async () => { },

  deleteWeek: async () => { },
} ) );

export default useWeeksStore;
