import { getTrainingsFromUser } from "@/lib/training.appwrite";
import { Training } from "@/types";
import { create } from "zustand";
import useAuthStore from "./auth.store";

type TrainingState = {
	trainings: Training[];
	isLoadingTrainings: boolean;

	setTrainings: ( trainings: Training[] ) => void;
	setIsLoadingTrainings: ( value: boolean ) => void;
	fetchUserTrainings: () => Promise<void>;
	addTrainingStore: ( training: Training ) => void;
	updateTrainingStore: (
		trainingId: string,
		updatedTraining: Partial<Training>
	) => void;
	deleteTrainingStore: ( trainingId: string )=> void;
};

const useTrainingsStore = create<TrainingState>( ( set ) => ( {
	trainings: [],
	isLoadingTrainings: false,

	setTrainings: ( trainings: Training[] ) => set( { trainings } ),
	setIsLoadingTrainings: ( value: boolean ) => set( { isLoadingTrainings: value } ),

	fetchUserTrainings: async () => {
		const { isAuthenticated } = useAuthStore.getState();
		if ( !isAuthenticated ) return;

		set( { isLoadingTrainings: true } );

		try {
			const trainings = await getTrainingsFromUser();
			set( { trainings } );
		} catch ( error ) {
			console.error( "Erreur lors de la récupération des entraînements:", error );
			set( { trainings: [] } );
		} finally {
			set( { isLoadingTrainings: false } );
		}
	},

	addTrainingStore: ( training: Training ) => {
		set( ( state ) => ( { trainings: [ ...state.trainings, training ] } ) );
	},

	updateTrainingStore: ( trainingId: string, updatedTraining: Partial<Training> ) => {
		set( ( state ) => ( {
			trainings: state.trainings.map( ( training ) =>
				training.$id === trainingId
					? { ...training, ...updatedTraining }
					: training
			),
		} ) );
	},

	deleteTrainingStore: ( trainingId: string ) => {
		set( ( state ) => ( {
			trainings: state.trainings.filter( ( training ) => training.$id !== trainingId )
		} ) );
	}
} ) );

export default useTrainingsStore;