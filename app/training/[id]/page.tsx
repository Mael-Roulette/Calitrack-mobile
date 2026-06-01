import PageHeader from "@/components/headers/PageHeader";
import SeriesCard from "@/components/trainings/series/SeriesCard";
import ActionsMenu, { ActionMenuItem } from "@/components/ui/ActionsMenu";
import { DAY_LABELS } from "@/constants/value";
import useTrainingActions from "@/hooks/actions/useTrainingActions";
import useTrainingsStore from "@/store/training.store";
import { showAlert } from "@/utils/alert";
import { formatMinutesDuration } from "@/utils/string";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page () {
  const { id } = useLocalSearchParams();
  const { currentTraining, fetchTrainingById } = useTrainingsStore();
  const [ showMenu, setShowMenu ] = useState( false );
  const { handleDelete } = useTrainingActions();

  useEffect( () => {
    const load = async () => {
      try {
        await fetchTrainingById( id as string );
      } catch {
        showAlert.error( "Impossible de charger l'entrainement", () => router.push( "/weeks" ) );
      }
    };
    load();
  }, [ id ] );

  const items: ActionMenuItem[] = [
    {
      icon: "edit-2",
      text: "Modifier",
      onPress: () => handleEditTraining(),
    },
    {
      icon: "trash-2",
      text: "Supprimer",
      onPress: () => handleDeleteTraining(),
      color: "#ef4444",
      textColor: "#ef4444",
    },
  ];

  const handleEditTraining = useCallback(() => {
    if (currentTraining) {
      router.push({
        pathname: "/training/edit-training-step-1",
        params: { trainingId: currentTraining.$id },
      });
    }
  }, [currentTraining]);

  const handleDeleteTraining = useCallback( async () => {
    if ( currentTraining ) {
      await handleDelete( { trainingId: currentTraining.$id, weekId: currentTraining.week } );
    }
  }, [ handleDelete, currentTraining?.$id ] );

  return (
    <View className="flex-1">
      <View className="flex-1">
        { !currentTraining ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' color='#0000ff' />
            <Text>Chargement...</Text>
          </View>
        ) : (
          <>
            <PageHeader
              title={ currentTraining.name }
              onRightPress={ () => setShowMenu( true ) }
              rightIcon="ellipsis-vertical"
            />
            <ScrollView className="px-5 bg-background">
              <ScrollView
                horizontal={ true }
                showsHorizontalScrollIndicator={ false }
                contentContainerStyle={ { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 20 } }
              >
                { currentTraining.days!.map( ( day, index ) => (
                  <Text
                    key={ index }
                    className="py-1 px-3 bg-background rounded-full border border-secondary text text-secondary"
                  >
                    { DAY_LABELS[ day ] ?? day }
                  </Text>
                ) ) }
              </ScrollView>

              <View className="flex-row items-end gap-1">
                <Text className="text text-2xl font-calsans">Durée : </Text>
                <Text className="text text-xl">{ formatMinutesDuration( currentTraining.duration ) }</Text>
              </View>

              { currentTraining.note &&
                <View className="mt-5">
                  <Text className="text text-2xl font-calsans">Note personnelle : </Text>
                  <Text className="text text-xl">{ currentTraining.note }</Text>
                </View>
              }

              <View className="mt-5">
                <Text className="text text-2xl font-calsans">
                  Mes séries ({ currentTraining.series?.length ?? 0 })
                </Text>

                <View className="flex-col gap-2 mt-3">
                  { currentTraining.series?.map( ( serie, index ) => (
                    <SeriesCard serie={ serie } key={ index } />
                  ) ) }
                </View>
              </View>
            </ScrollView>
          </>
        ) }
      </View>

      <ActionsMenu
        visible={ showMenu }
        onClose={ () => setShowMenu( false ) }
        items={ items }
      />
    </View>
  );
}