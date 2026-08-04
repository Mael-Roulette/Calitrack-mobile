import PageHeader from "@/components/headers/PageHeader";
import RenameTrainingModal from "@/components/trainings/RenameTrainingModal";
import SeriesCard from "@/components/trainings/series/SeriesCard";
import ActionsMenu, { ActionMenuItem } from "@/components/ui/ActionsMenu";
import { DAY_LABELS } from "@/constants/date";
import useTrainingActions from "@/hooks/actions/training/useTrainingActions";
import useTrainingsStore from "@/store/training.store";
import { showAlert } from "@/utils/alert";
import { formatMinutesDuration } from "@/utils/string";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

export default function Page () {
  const { id } = useLocalSearchParams();
  const { currentTraining, fetchTrainingById } = useTrainingsStore();
  const [ showMenu, setShowMenu ] = useState( false );
  const [ showRenameModal, setShowRenameModal ] = useState( false );
  const { handleDelete } = useTrainingActions();

  useEffect( () => {
    const load = async () => {
      try {
        await fetchTrainingById( id as string );
      } catch {
        showAlert.error( "Impossible de charger l'entraînement", () => router.push( "/weeks" ) );
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ id ] );

  const items: ActionMenuItem[] = [
    {
      icon: "type",
      text: "Renommer",
      onPress: () => handleRenameTraining(),
    },
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

  const handleRenameTraining = () => {
    setShowRenameModal( true );
  };

  const handleEditTraining = useCallback( () => {
    if ( currentTraining ) {
      router.push( {
        pathname: "/training/edit-training-step-1",
        params: { trainingId: currentTraining.$id },
      } );
    }
  }, [ currentTraining ] );

  const handleDeleteTraining = useCallback( async () => {
    if ( currentTraining ) {
      await handleDelete( { trainingId: currentTraining.$id, weekId: currentTraining.week } );
    }
  }, [ handleDelete, currentTraining ] );

  if ( !currentTraining ) {
    return (
      <View className="h-full flex items-center justify-center">
        <Text>L&apos;entraînement que vous essayez d&apos;atteindre n&apos;existe pas.</Text>
      </View>
    );
  }

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
                  { currentTraining.series?.map( ( series, index ) => (
                    <SeriesCard series={ series } key={ index } />
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

      <RenameTrainingModal
        modalVisible={ showRenameModal }
        setModalVisible={ setShowRenameModal }
        trainingId={ currentTraining.$id }
        actualTrainingName={ currentTraining.name }
      />
    </View>
  );
}