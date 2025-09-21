import useExercicesStore from "@/store/exercises.stores";
import { router } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import ExerciseItem from "./components/ExerciseItem";


const ExerciseList = () => {
	const { exercices } = useExercicesStore();

	const goToExerciseDetails = ( id: string ) => {
		router.push( {
			pathname: "/exercise/[id]",
			params: { id },
		} );
	};

	return (
		<View className='px-5 bg-background flex-1'>
			<View>
				<FlatList
					data={ exercices }
					renderItem={ ( { item } ) => (
						<ExerciseItem
							name={ item.name }
							type={ item.type.name }
							difficulty={ item.difficulty }
							onPress={ () => goToExerciseDetails( item.$id ) }
						/>
					) }
					keyExtractor={ ( item ) => item.$id }
					showsVerticalScrollIndicator={ false }
				/>
			</View>
		</View>
	);
};

export default ExerciseList;
