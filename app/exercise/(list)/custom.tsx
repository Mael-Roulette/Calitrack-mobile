import useExercicesStore from "@/store/exercises.stores";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";
import ExerciseItem from "../components/ExerciseItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Exercise } from "@/types";
import CustomInput from "@/components/CustomInput";


const CustomExerciseList = () => {
  const { exercices } = useExercicesStore();
  const [ filteredExercises, setFilteredExercises ] = useState<Exercise[]>();

  useEffect( () => {
    setFilteredExercises( exercices );
  }, [ exercices ] );

  const goToExerciseDetails = ( id: string ) => {
    router.push( {
      pathname: "/exercise/[id]",
      params: { id },
    } );
  };

  /* ----- Recherche d'exercice ----- */
  const handleSearch = ( text: string ) => {
    if ( !text.trim() ) {
      setFilteredExercises( exercices );
      return;
    }

    const query = text.toLowerCase();
    const filtered = exercices.filter(
      ( exercise ) =>
        exercise.name?.toLowerCase().includes( query ) ||
        exercise.type?.toLowerCase().includes( query )
    );

    setFilteredExercises( filtered );
  };

  return (
    <SafeAreaView className='bg-background flex-1 px-5 ' edges={ [ 'bottom' ] }>
      <Text className="title-2 mb-4">Généraux</Text>
      <View>
        <CustomInput
          label='Rechercher un mouvement'
          placeholder='Ex : Front, planche, ...'
          onChangeText={ handleSearch }
          customStyles='mb-4'
        />
        <FlatList
          data={ filteredExercises }
          renderItem={ ( { item } ) => (
            <ExerciseItem
              image={ item.image }
              name={ item.name }
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

export default CustomExerciseList;
