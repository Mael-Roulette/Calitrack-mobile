import SimpleHeader from "@/components/headers/SimpleHeader";
import AddWeekModal from "@/components/trainings/week/AddWeekModal";
import CustomButton from "@/components/ui/CustomButton";
import { getUserWeeks } from "@/lib/week.appwrite";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GoalsPage () {
  const [ weeks, setWeeks ] = useState( [] );
  const [ modalVisible, setModalVisible ] = useState( false );
  const [ isLoading, setIsLoading ] = useState( true );

  // Charger les semaines au montage du composant
  useEffect( () => {
    loadWeeks();
  }, [] );

  const loadWeeks = async () => {
    try {
      setIsLoading( true );
      const fetchedWeeks = await getUserWeeks();

      console.log( fetchedWeeks );
    } catch ( error ) {
      console.error( "Erreur lors du chargement des semaines:", error );
    } finally {
      setIsLoading( false );
    }
  };

  const handleAddPress = () => {
    setModalVisible( true );
  };

  // Recharger les semaines quand la modal se ferme
  useEffect( () => {
    if ( !modalVisible ) {
      loadWeeks();
    }
  }, [ modalVisible ] );

  return (
    <SafeAreaView style={ { flex: 1, backgroundColor: "#FC7942" } }>
      <SimpleHeader
        title="Mes séances"
        subtitle="Vos semaines d'entraînement"
        count={ `${weeks.length}/4` }
        onAddPress={ handleAddPress }
      />

      <ScrollView className="flex-1 bg-background px-5 pt-5">
        {/* {weeks.length === 0 ? (
          <EmptyState
            title="Aucune semaine d'entraînement"
            buttonText="Ajouter une semaine"
            handlePress={ handleAddPress }
          />
        ) : (
          weeks.map( ( week ) => (
            <WeekItem key={ week.$id } week={ week } />
          ) )
        )} */}
      </ScrollView>

      <View className="p-5 bg-background">
        <CustomButton
          title="Voir les mouvements"
          onPress={ () => router.push( "/exercises" ) }
        />
      </View>

      <AddWeekModal
        modalVisible={ modalVisible }
        setModalVisible={ setModalVisible }
        nextOrder={ weeks.length + 1 }
      />
    </SafeAreaView>
  );
}