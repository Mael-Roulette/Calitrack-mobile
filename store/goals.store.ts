import { getGoalsFromUser } from "@/lib/goal.appwrite";
import { Goal } from "@/types";
import { create } from "zustand";
import useAuthStore from "./auth.store";

type GoalState = {
	goals: Goal[];
	isLoadingGoals: boolean;
	loaded: boolean;

	setGoals: ( goals: Goal[] ) => void;
	setIsLoadingGoals: ( value: boolean ) => void;
	fetchUserGoals: () => Promise<void>;
	addGoalStore: ( goal: Goal ) => void;
	updateGoalStore: ( goalId: string, updatedGoal: Partial<Goal> ) => void;
	deleteGoalStore: ( goalId: string ) => void;
};

const useGoalsStore = create<GoalState>( ( set, get ) => ( {
	goals: [],
	isLoadingGoals: false,
	loaded: false,

	setGoals: ( goals: Goal[] ) => set( { goals } ),
	setIsLoadingGoals: ( value: boolean ) => set( { isLoadingGoals: value } ),

	fetchUserGoals: async () => {
		const { isAuthenticated } = useAuthStore.getState();
		if ( !isAuthenticated ) return;

		if ( get().loaded ) return;

		set( { isLoadingGoals: true } );

		try {
			const documents = await getGoalsFromUser();
			const goals = documents.map(
				( doc ) =>
					( {
						$id: doc.$id,
						$createdAt: doc.$createdAt,
						$updatedAt: doc.$updatedAt,
						exercise: doc.exercise,
						progress: doc.progress,
						progressHistory: JSON.parse( doc.progressHistory || "[]" ),
						total: doc.total,
						state: doc.state,
					} ) as Goal
			);
			set( { goals, loaded: true } );
		} catch ( error ) {
			console.error( "Erreur lors de la récupération des objectifs:", error );
			set( { goals: [] } );
		} finally {
			set( { isLoadingGoals: false } );
		}
	},

	addGoalStore: ( goal: Goal ) => {
		set( ( state ) => ( { goals: [ ...state.goals, goal ] } ) );
	},

	updateGoalStore: ( goalId: string, updatedGoal: Partial<Goal> ) => {
		set( ( state ) => ( {
			goals: state.goals.map( ( goal ) =>
				goal.$id === goalId ? { ...goal, ...updatedGoal } : goal
			),
		} ) );
	},

	deleteGoalStore: ( goalId: string ) => {
		set( ( state ) => ( {
			goals: state.goals.filter( ( goal ) => goal.$id !== goalId )
		} ) );
	}
} ) );

export default useGoalsStore;
