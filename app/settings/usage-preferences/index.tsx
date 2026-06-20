import PageHeader from "@/components/headers/PageHeader";
import CustomButton from "@/components/ui/CustomButton";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getBoolean, setBoolean } from "@/utils/storage";
import * as KeepAwake from "expo-keep-awake";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

const Index = () => {
  const [ isAvailable, setIsAvailable ] = useState( false );
  const [ isActive, setIsActive ] = useState( false );

  useEffect( () => {
    const init = async () => {
      try {
        const available = await KeepAwake.isAvailableAsync();
        setIsAvailable( available );
        if ( !available ) return;

        const saved = await getBoolean( STORAGE_KEYS.KEEP_AWAKE_ENABLED, false );
        if ( saved ) {
          await KeepAwake.activateKeepAwakeAsync();
          setIsActive( true );
        }
      } catch ( error ) {
        console.log( "Erreur init KeepAwake:", error );
      }
    };
    init();
  }, [] );

  const toggleKeepAwake = async () => {
    const next = !isActive;
    if ( next ) {
      await KeepAwake.activateKeepAwakeAsync();
    } else {
      await KeepAwake.deactivateKeepAwake();
    }
    setIsActive( next );
    await setBoolean( STORAGE_KEYS.KEEP_AWAKE_ENABLED, next );
  };

  return (
    <View className="bg-background flex-1">
      <PageHeader title="Préférences d’utilisation" />
      <ScrollView className="p-5">
        <Text className="title-2 mb-3">Entraînement</Text>
        <Text className="indicator-text mb-2">
          Si cette fonction est activée, pendant vos entraînements votre écran restera allumé.
        </Text>

        {!isAvailable && (
          <Text className="text-red-500 mb-2">
            Cette fonctionnalité n&apos;est pas disponible sur cet appareil.
          </Text>
        )}

        <CustomButton
          title={ isActive ? "Désactiver" : "Activer" }
          onPress={ toggleKeepAwake }
        />
      </ScrollView>
    </View>
  );
};

export default Index;