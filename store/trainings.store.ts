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
	addTraining: ( training: Training ) => void;
	updateTraining: (
		trainingId: string,
		updatedTraining: Partial<Training>
	) => void;
};

const useTrainingsStore = create<TrainingState>( ( set, get ) => ( {
	trainings: [],
	isLoadingTrainings: false,

	setTrainings: ( trainings: Training[] ) => set( { trainings } ),
	setIsLoadingTrainings: ( value: boolean ) => set( { isLoadingTrainings: value } ),

	fetchUserTrainings: async () => {
		const { isAuthenticated } = useAuthStore.getState();
		if ( !isAuthenticated ) return;

		set( { isLoadingTrainings: true } );

		try {
			const documents = await getTrainingsFromUser();
			const trainings = documents.map(
				( doc ) =>
					( {
						$id: doc.$id,
						user: doc.user,
						name: doc.name,
						days: doc.days,
						duration: doc.duration,
					} ) as Training
			);
			set( { trainings } );
		} catch ( error ) {
			console.error( "Erreur lors de la récupération des entraînements:", error );
			set( { trainings: [] } );
		} finally {
			set( { isLoadingTrainings: false } );
		}
	},

	addTraining: ( training: Training ) => {
		set( ( state ) => ( { trainings: [ ...state.trainings, training ] } ) );
	},

	updateTraining: ( trainingId: string, updatedTraining: Partial<Training> ) => {
		set( ( state ) => ( {
			trainings: state.trainings.map( ( training ) =>
				training.$id === trainingId
					? { ...training, ...updatedTraining }
					: training
			),
		} ) );
	},
} ) );

export default useTrainingsStore;
