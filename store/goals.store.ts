import { getGoalsFromUser } from "@/lib/goal.appwrite";
import { Goal } from "@/types";
import { create } from "zustand";
import useAuthStore from "./auth.store";

interface GoalState {
	goals: Goal[];
	isLoading: boolean;
	error: string | null;
	loaded: boolean;

	// Actions de base
	setGoals: ( goals: Goal[] ) => void;
	setIsLoadingGoals: ( value: boolean ) => void;
	setError: ( error: string | null ) => void;

	// Actions CRUD
	fetchUserGoals: () => Promise<void>;
	refreshGoals: () => Promise<void>;
	addGoalStore: ( goal: Goal ) => void;
	updateGoalStore: ( goalId: string, updatedGoal: Partial<Goal> ) => void;
	deleteGoalStore: ( goalId: string ) => void;

	// Actions utilitaires
	getGoalById: ( goalId: string ) => Goal | undefined;
	getActiveGoals: () => Goal[];
	getFinishedGoals: () => Goal[];
	clearGoals: () => void;
}

const useGoalsStore = create<GoalState>( ( set, get ) => ( {
  goals: [],
  isLoading: false,
  error: null,
  loaded: false,

  // Setters
  setGoals: ( goals: Goal[] ) => set( { goals, error: null } ),
  setIsLoadingGoals: ( value: boolean ) => set( { isLoading: value } ),
  setError: ( error: string | null ) => set( { error } ),

  // Récupération initiale des objectifs
  fetchUserGoals: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    const state = get();

    if ( !isAuthenticated ) {
      set( { error: "Utilisateur non authentifié" } );
      return;
    }

    // Éviter les appels multiples
    if ( state.isLoading ) return; // Bloquer seulement pendant le chargement
    if ( state.loaded && !state.error ) return; // OK si chargé sans erreur

    set( { isLoading: true, error: null } );

    try {
      const goals = await getGoalsFromUser();
      set( {
        goals,
        loaded: true,
        error: null
      } );
    } catch ( error ) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Erreur lors de la récupération des objectifs";

      console.error( "Erreur fetchUserGoals:", error );
      set( {
        goals: [],
        error: errorMessage,
        loaded: false
      } );
    } finally {
      set( { isLoading: false } );
    }
  },

  // Rafraîchir les objectifs
  refreshGoals: async () => {
    const { isAuthenticated } = useAuthStore.getState();

    if ( !isAuthenticated ) {
      set( { error: "Utilisateur non authentifié" } );
      return;
    }

    set( { isLoading: true, error: null } );

    try {
      const goals = await getGoalsFromUser();
      set( {
        goals,
        error: null
      } );
    } catch ( error ) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Erreur lors du rafraîchissement des objectifs";

      console.error( "Erreur refreshGoals:", error );
      set( { error: errorMessage } );
    } finally {
      set( { isLoading: false } );
    }
  },

  // Ajouter un objectif au store
  addGoalStore: ( goal: Goal ) => {
    set( ( state ) => ( {
      goals: [ goal, ...state.goals ],
      error: null
    } ) );
  },

  // Mettre à jour un objectif
  updateGoalStore: ( goalId: string, updatedGoal: Partial<Goal> ) => {
    set( ( state ) => ( {
      goals: state.goals.map( ( goal ) =>
        goal.$id === goalId
          ? { ...goal, ...updatedGoal }
          : goal
      ),
      error: null
    } ) );
  },

  // Supprimer un objectif
  deleteGoalStore: ( goalId: string ) => {
    set( ( state ) => ( {
      goals: state.goals.filter( ( goal ) => goal.$id !== goalId ),
      error: null
    } ) );
  },

  // Récupérer un objectif par son ID
  getGoalById: ( goalId: string ) => {
    return get().goals.find( ( goal ) => goal.$id === goalId );
  },

  // Récupérer les objectifs en cours
  getActiveGoals: () => {
    return get().goals.filter( ( goal ) => goal.state === "in-progress" );
  },

  // Récupérer les objectifs terminés
  getFinishedGoals: () => {
    return get().goals.filter( ( goal ) => goal.state === "finished" );
  },

  // Réinitialiser les objectifs
  clearGoals: () => {
    set( {
      goals: [],
      loaded: false,
      error: null
    } );
  }
} ) );

export default useGoalsStore;