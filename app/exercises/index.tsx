import ExerciseItem from "@/components/exercises/ExerciseItem";
import PageHeader from "@/components/headers/PageHeader";
import { LIMITS } from "@/constants/value";
import { useExerciseFilters } from "@/hooks/useExerciseFilters";
import { useExercicesStore } from "@/store";
import { router } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ExerciseList = () => {
  const { exercices } = useExercicesStore();
  const { activeTab, setActiveTab, filteredExercises } = useExerciseFilters( exercices );

  const goToExerciseDetails = ( id: string ) => {
    router.push( {
      pathname: "/exercises/[id]",
      params: { id },
    } );
  };

  return (
    <SafeAreaView className="bg-background flex-1" edges={ [ "bottom" ] }>
      <PageHeader
        title="Les mouvements"
        onRightPress={ () => router.push( "/exercises/add-exercise" ) }
      />
      {/* Custom Tabs */ }
      <View className="flex-row border-b border-primary-100/20">
        <TouchableOpacity
          className={ `flex-1 py-4 items-center ${activeTab === "all" ? "border-b-2 border-secondary" : ""
          }` }
          onPress={ () => setActiveTab( "all" ) }
        >
          <Text
            className={ `title-3 ${activeTab === "all" ? "text-secondary" : "text-primary-100"
            }` }
          >
            Généraux
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={ `flex-1 py-4 items-center ${activeTab === "custom" ? "border-b-2 border-secondary" : ""
          }` }
          onPress={ () => setActiveTab( "custom" ) }
        >
          <Text
            className={ `title-3 ${activeTab === "custom" ? "text-secondary" : "text-primary-100"
            }` }
          >
            Personnalisés
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */ }
      <View className="flex-1 px-2 pt-4 pb-5">
        { activeTab === "custom" &&
          <Text className="indicator-text mb-4">Nombre d&apos;exercices personnalisés : { filteredExercises.length } / { LIMITS.MAX_CUSTOM_EXERCISES } </Text>
        }

        <FlatList
          data={ filteredExercises }
          renderItem={ ( { item } ) => (
            <View style={ { flex: 1, maxWidth: "50%", padding: 5 } }>
              <ExerciseItem
                exercise={ item }
                onPress={ () => goToExerciseDetails( item.$id ) }
              />
            </View>
          ) }
          keyExtractor={ ( item ) => item.$id }
          showsVerticalScrollIndicator={ false }
          ListEmptyComponent={
            <Text className="text-center text-primary-100 mt-4">
              Aucun exercice trouvé
            </Text>
          }
          numColumns={ 2 }
          columnWrapperStyle={ { paddingHorizontal: 0 } }
        />
      </View>
    </SafeAreaView>
  );
};

export default ExerciseList;