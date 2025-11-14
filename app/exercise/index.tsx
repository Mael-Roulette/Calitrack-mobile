// app/exercise/exercise-list.tsx
import useExercicesStore from "@/store/exercises.stores";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, View, Text, TouchableOpacity } from "react-native";
import ExerciseItem from "../exercise/components/ExerciseItem";
import { SafeAreaView } from "react-native-safe-area-context";
import { Exercise } from "@/types";
import CustomInput from "@/components/CustomInput";

const ExerciseList = () => {
  const { exercices } = useExercicesStore();
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'custom'>('all');

  useEffect(() => {
    // Filtrer selon l'onglet actif
    if (activeTab === 'all') {
      // Tous les exercices SAUF les personnalisés
      const allExercises = exercices.filter(ex => !ex.isCustom);
      setFilteredExercises(allExercises);
    } else {
      // Uniquement les exercices personnalisés de l'utilisateur
      const customExercises = exercices.filter(ex => ex.isCustom === true);
      setFilteredExercises(customExercises);
    }
  }, [exercices, activeTab]);

  const goToExerciseDetails = (id: string) => {
    router.push({
      pathname: "/exercise/[id]",
      params: { id },
    });
  };

  /* ----- Recherche d'exercice ----- */
  const handleSearch = (text: string) => {
    if (!text.trim()) {
      if (activeTab === 'all') {
        const allExercises = exercices.filter(ex => !ex.isCustom);
        setFilteredExercises(allExercises);
      } else {
        const customExercises = exercices.filter(ex => ex.isCustom === true);
        setFilteredExercises(customExercises);
      }
      return;
    }

    const query = text.toLowerCase();
    const baseExercises = activeTab === 'all'
      ? exercices.filter(ex => !ex.isCustom)
      : exercices.filter(ex => ex.isCustom === true);

    const filtered = baseExercises.filter(
      (exercise) =>
        exercise.name?.toLowerCase().includes(query) ||
        exercise.type?.toLowerCase().includes(query)
    );

    setFilteredExercises(filtered);
  };

  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      {/* Custom Tabs */}
      <View className="flex-row border-b border-primary-100/20">
        <TouchableOpacity
          className={`flex-1 py-4 items-center ${
            activeTab === 'all' ? 'border-b-2 border-secondary' : ''
          }`}
          onPress={() => setActiveTab('all')}
        >
          <Text
            className={`title-3 ${
              activeTab === 'all' ? 'text-secondary' : 'text-primary-100'
            }`}
          >
            Généraux
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`flex-1 py-4 items-center ${
            activeTab === 'custom' ? 'border-b-2 border-secondary' : ''
          }`}
          onPress={() => setActiveTab('custom')}
        >
          <Text
            className={`title-3 ${
              activeTab === 'custom' ? 'text-secondary' : 'text-primary-100'
            }`}
          >
            Personnalisés
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1 px-5 pt-4">
        <CustomInput
          label="Rechercher un mouvement"
          placeholder="Ex : Front, planche, ..."
          onChangeText={handleSearch}
          customStyles="mb-4"
        />

        <FlatList
          data={filteredExercises}
          renderItem={({ item }) => (
            <ExerciseItem
              image={item.image}
              name={item.name}
              difficulty={item.difficulty}
              onPress={() => goToExerciseDetails(item.$id)}
            />
          )}
          keyExtractor={(item) => item.$id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-primary-100 mt-4">
              Aucun exercice trouvé
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ExerciseList;