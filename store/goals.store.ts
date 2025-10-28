import { getGoalsFromUser } from "@/lib/goal.appwrite";
import { Goal } from "@/types";
import { create } from "zustand";
import useAuthStore from "./auth.store";

type GoalState = {
	goals: Goal[];
	isLoadingGoals: boolean;

	setGoals: ( goals: Goal[] ) => void;
	setIsLoadingGoals: ( value: boolean ) => void;
	fetchUserGoals: () => Promise<void>;
	addGoal: ( goal: Goal ) => void;
	updateGoal: ( goalId: string, updatedGoal: Partial<Goal> ) => void;
};

const useGoalsStore = create<GoalState>( ( set ) => ( {
	goals: [],
	isLoadingGoals: false,

	setGoals: ( goals: Goal[] ) => set( { goals } ),
	setIsLoadingGoals: ( value: boolean ) => set( { isLoadingGoals: value } ),

	fetchUserGoals: async () => {
		const { isAuthenticated } = useAuthStore.getState();
		if ( !isAuthenticated ) return;

		set( { isLoadingGoals: true } );

		try {
			const documents = await getGoalsFromUser();
			const goals = documents.map(
				( doc ) =>
					( {
						$id: doc.$id,
						$createdAt: doc.$createdAt,
						$updatedAt: doc.$updatedAt,
						title: doc.title,
						progress: doc.progress,
						progressHistory: JSON.parse( doc.progressHistory || "[]" ),
						total: doc.total,
						state: doc.state,
					} ) as Goal
			);
			set( { goals } );
		} catch ( error ) {
			console.error( "Erreur lors de la récupération des objectifs:", error );
			set( { goals: [] } );
		} finally {
			set( { isLoadingGoals: false } );
		}
	},

	addGoal: ( goal: Goal ) => {
		set( ( state ) => ( { goals: [ ...state.goals, goal ] } ) );
	},

	updateGoal: ( goalId: string, updatedGoal: Partial<Goal> ) => {
		set( ( state ) => ( {
			goals: state.goals.map( ( goal ) =>
				goal.$id === goalId ? { ...goal, ...updatedGoal } : goal
			),
		} ) );
	},
} ) );

export default useGoalsStore;
