import PageHeader from "@/components/headers/PageHeader";
import { DAY_LABELS } from "@/constants/value";
import { getTrainingById } from "@/lib/training.appwrite";
import { Training } from "@/types";
import { showAlert } from "@/utils/alert";
import { formatDuration } from "@/utils/string";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Page () {
  const { id } = useLocalSearchParams();
  const [ training, setTraining ] = useState<Training>();
  const [ isLoading, setIsLoading ] = useState( true );
  const [ showMenu, setShowMenu ] = useState( false );

  useEffect( () => {
    const fetchTraining = async () => {
      setIsLoading( true );

      try {
        const response = await getTrainingById( id as string );
        setTraining( response as unknown as Training );
      } catch ( error ) {
        console.error( "Erreur lors de la récupération de l'entrainement: ", error );
        showAlert.error( "Impossible de charger l'entrainement",() => router.push( "/weeks" ) );
      } finally {
        setIsLoading( false );
      }
    };

    fetchTraining();
  }, [ id ] );

  return (
    <SafeAreaView className='flex-1 bg-secondary' edges={ [ "bottom" ] }>
      <View className="flex-1">
        { isLoading ? (
          <View className='flex-1 items-center justify-center'>
            <ActivityIndicator size='large' color='#0000ff' />
            <Text>Chargement...</Text>
          </View>
        ) : (
          <>
            <PageHeader
              title={ training!.name }
              onRightPress={ () => setShowMenu( true ) }
              rightIcon="menu"
            />
            <ScrollView className="px-5 bg-background">
              <ScrollView
                horizontal={ true }
                showsHorizontalScrollIndicator={ false }
                contentContainerStyle={ { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 20 } }
              >
                { training!.days!.map( ( day, index ) => (
                  <Text
                    key={ index }
                    className="py-1 px-3 bg-background rounded-full border border-secondary text text-secondary"
                  >
                    { DAY_LABELS[ day ] ?? day }
                  </Text>
                ) ) }
              </ScrollView>

              <View className="flex-row gap-1">
                <Text className="text text-xl font-calsans">Durée : </Text>
                <Text className="text text-xl">{ formatDuration( training!.duration ) }</Text>
              </View>

              { training!.note &&
                <View>
                  <Text className="text text-xl font-calsans">Note personnelle : </Text>
                  <Text className="text text-xl">{ training!.note }</Text>
                </View>
              }

              <View>
                <Text className="text text-xl font-calsans">Mes séries ( { training!.series?.length } )</Text>
              </View>
            </ScrollView>
          </>
        ) }
      </View>
    </SafeAreaView>
  );
}