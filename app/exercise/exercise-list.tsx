import useExercicesStore from "@/store/exercises.stores";
import { router } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import ExerciseItem from "./components/ExerciseItem";
import { SafeAreaView } from "react-native-safe-area-context";


const ExerciseList = () => {
	const { exercices } = useExercicesStore();

	const goToExerciseDetails = ( id: string ) => {
		router.push( {
			pathname: "/exercise/[id]",
			params: { id },
		} );
	};

	return (
		<SafeAreaView className='bg-background flex-1 px-5 ' edges={ [ 'bottom' ] }>
			<View>
				<FlatList
					data={ exercices }
					renderItem={ ( { item } ) => (
						<ExerciseItem
							name={ item.name }
							type={ item.type }
							difficulty={ item.difficulty }
							onPress={ () => goToExerciseDetails( item.$id ) }
						/>
					) }
					keyExtractor={ ( item ) => item.$id }
					showsVerticalScrollIndicator={ false }
				/>
			</View>
		</SafeAreaView>
	);
};

export default ExerciseList;
