import PageHeaderWithTabs from "@/components/headers/PageHeaderWithTabs";
import UsageGeneralSection from "@/components/settings/UsageGeneralSection";
import UsageTrainingSection from "@/components/settings/UsageTrainingSection";
import { useKeepAwakePreference } from "@/hooks/useKeepAwakePreference";
import { useRestNotificationPreference } from "@/hooks/useRestNotificationPreference";
import { useRestSoundPreference } from "@/hooks/useRestSoundPreference";
import { useState } from "react";
import { ScrollView, View } from "react-native";

const UsageTabs = [ "Générale", "Entraînement" ] as const;
type UsageTabsType = ( typeof UsageTabs )[number];

const Index = () => {
  const [ activeTab, setActiveTab ] = useState<UsageTabsType>( UsageTabs[ 0 ] );

  const {
    isAvailable: isKeepAwakeAvailable,
    isActive: isKeepAwakeActive,
    toggle: toggleKeepAwake,
  } = useKeepAwakePreference();

  const {
    isAvailable: isRestNotificationAvailable,
    isActive: isRestNotificationActive,
    toggle: toggleRestNotification,
  } = useRestNotificationPreference();

  const { isActive: isRestSoundActive, toggle: toggleRestSound } = useRestSoundPreference();

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
