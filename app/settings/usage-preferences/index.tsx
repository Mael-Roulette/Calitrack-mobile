import PageHeaderWithTabs from "@/components/headers/PageHeaderWithTabs";
import UsageGeneralSection from "@/components/settings/UsageGeneralSection";
import UsageTrainingSection from "@/components/settings/UsageTrainingSection";
import { STORAGE_KEYS } from "@/constants/storageKeys";
import { getBoolean, setBoolean } from "@/utils/storage";
import * as KeepAwake from "expo-keep-awake";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const UsageTabs = [ "Générale", "Entraînement" ] as const;
type UsageTabsType = ( typeof UsageTabs )[number];

const Index = () => {
  const [ activeTab, setActiveTab ] = useState<UsageTabsType>( UsageTabs[ 0 ] );

  // State pour l'état de l'écran
  const [ isKeepAwakeAvailable, setIsKeepAwakeAvailable ] = useState<boolean>( false );
  const [ isKeepAwakeActive, setIsKeepAwakeActive ] = useState<boolean>( false );

  // State pour les notifications de l'écran de repos
  const [ isRestNotificationAvailable, setIsRestNotificationAvailable ] = useState<boolean>( false );
  const [ isRestNotificationActive, setIsRestNotificationActive ] = useState<boolean>( false );

  // State pour le son de l'écran de repos
  const [ isRestSoundActive, setIsRestSoundActive ] = useState<boolean>( false );

  useEffect( () => {
    const init = async () => {
      try {
        const keepAwakeAvailable = await KeepAwake.isAvailableAsync();
        setIsKeepAwakeAvailable( keepAwakeAvailable );
        if ( !keepAwakeAvailable ) return;

        const keppAwakeSaved = await getBoolean( STORAGE_KEYS.KEEP_AWAKE_ENABLED, false );
        if ( keppAwakeSaved ) {
          await KeepAwake.activateKeepAwakeAsync();
          setIsKeepAwakeActive( true );
        }
      } catch ( error ) {
        console.log( "Erreur init KeepAwake:", error );
      }
    };
    init();
  }, [] );

  const toggleKeepAwake = async () => {
    const next = !isKeepAwakeActive;
    if ( next ) {
      await KeepAwake.activateKeepAwakeAsync();
    } else {
      await KeepAwake.deactivateKeepAwake();
    }
    setIsKeepAwakeActive( next );
    await setBoolean( STORAGE_KEYS.KEEP_AWAKE_ENABLED, next );
  };

  const toggleRestNotification = async () => {
  };

  const toggleRestSound = async () => {
  };

  return (
    <View className="bg-background flex-1">
      <PageHeaderWithTabs
        title="Préférences d'utilisation"
        tabs={ UsageTabs }
        activeTab={ activeTab }
        onTabPress={ ( tab ) => setActiveTab( tab as UsageTabsType ) }
      />
      <ScrollView className="p-5">
        <View className="flex-1 bg-background">
          {activeTab === UsageTabs[ 0 ] ? (
            <UsageGeneralSection
            />
          ) : (
            <UsageTrainingSection
              isKeepAwakeActive={ isKeepAwakeActive }
              isKeepAwakeAvailable={ isKeepAwakeAvailable }
              toggleKeepAwake={ toggleKeepAwake }
              isRestNotificationActive={ isRestNotificationActive }
              isRestNotificationAvailable={ isRestNotificationAvailable }
              toggleRestNotification={ toggleRestNotification }
              isRestSoundActive={ isRestSoundActive }
              toggleRestSound={ toggleRestSound }
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;