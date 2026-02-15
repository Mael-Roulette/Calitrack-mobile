import PageHeader from "@/components/headers/PageHeader";
import ActionsMenu, { ActionMenuItem } from "@/components/ui/ActionsMenu";
import { getExerciseImage } from "@/constants/exercises";
import { getExerciseById } from "@/lib/exercise.appwrite";
import { Exercise } from "@/types";
import { showAlert } from "@/utils/alert";
import { getDifficultyInfo } from "@/utils/exercises";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ExerciseDetails = () => {
  const { id } = useLocalSearchParams();
  const [ exercise, setExercise ] = useState<Exercise>();
  const [ loading, setLoading ] = useState( true );
  const [ showMenu, setShowMenu ] = useState( false );

  useEffect(() => {
    const fetchExercise = async () => {
      setLoading(true);
      try {
        const response = await getExerciseById(id as string);
        setExercise(response as unknown as Exercise);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'exercice", error);

        showAlert.error("Impossible de charger l'exercice",() => router.push("/exercises") );
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [ id ]);

  let difficultyInfo;
  if ( !loading ) {
    difficultyInfo = getDifficultyInfo( exercise!.difficulty );
  }

  const items: ActionMenuItem[] = [
    {
      icon: "edit",
      text: "Modifier",
      onPress: () => router.push( {
        pathname: "/exercises/[id]/edit",
        params: { id: exercise!.$id }
      } )
    },
    {
      icon: "trash-2",
      text: "Supprimer",
      onPress: () => {},
      color: "#ef4444",
      textColor: "#ef4444",
    },
  ];

  const handleDelete = () => {

  }

  return (
    <SafeAreaView className='flex-1 bg-secondary' edges={ [ "bottom" ] }>
      <View className='flex-1'>
        { loading ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' color='#0000ff' />
            <Text>Chargement...</Text>
          </View>
        ) : (
          <>
            <PageHeader
              title={ exercise!.name }
              onRightPress={ exercise!.isCustom ? ( () => setShowMenu( true ) ): undefined }
              rightIcon="menu"
            />
            <ScrollView className="px-5 bg-background">
              { !exercise!.isCustom &&
                <View className='relative bg-secondary px-4 py-8 mt-5 rounded-md h-60 w-full items-center justify-center'>
                  { exercise!.image ? (
                    <Image
                      source={ getExerciseImage( exercise!.image ) }
                      style={ { width: 250, height: 250 } }
                      contentFit="cover"
                    />
                  ) : (
                    <Text className="title-3 text-background text-center">Illustration en cours de création…</Text>
                  ) }
                </View>
              }

              <View className="rounded-md py-5 px-4 mt-5 flex-col gap-4 border border-secondary">
                <View className="flex-row">
                  <Text className="text text-xl font-bold">Type de mouvement : </Text>
                  <Text className="text text-xl font-bold text-secondary">{ exercise!.type }</Text>
                </View>

                <View className="flex-row">
                  <Text className="text text-xl font-bold">Difficulté : </Text>
                  <Text className="text text-xl font-bold text-secondary">{ difficultyInfo ? difficultyInfo.label : exercise!.difficulty }</Text>
                </View>

                <View>
                  <Text className="text text-xl font-bold">Description : </Text>
                  <Text className="text text-xl">{ exercise!.description }</Text>
                </View>
              </View>
            </ScrollView>

            <ActionsMenu
              visible={showMenu}
              onClose={() => setShowMenu(false)}
              items={items}
            />
          </>
        ) }
      </View>
    </SafeAreaView>
  );
};

export default ExerciseDetails;