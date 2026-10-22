import PageHeaderWithTabs from "@/components/headers/PageHeaderWithTabs";
import CalendarSection from "@/components/planning/Calendar";
import HistorySection from "@/components/planning/History";
import useSessionsStore from "@/store/session.store";
import { useEffect, useState } from "react";
import { View } from "react-native";

const PlanningTabs = [ "Calendrier", "Historique" ] as const;
type PlanningTab = ( typeof PlanningTabs )[number];

const PlanningScreen = () => {
  const [ activeTab, setActiveTab ] = useState<PlanningTab>( PlanningTabs[ 0 ] );

  const sessions = useSessionsStore( ( s ) => s.sessions );
  const isLoadingSession = useSessionsStore( ( s ) => s.isLoading );
  const errorLoadingSession = useSessionsStore( ( s ) => s.error );
  const fetchUserSessions = useSessionsStore( ( s ) => s.fetchUserSessions );

  useEffect( () => {
    fetchUserSessions();
  }, [ fetchUserSessions ] );

  return (
    <View className="flex-1">
      <PageHeaderWithTabs
        title="Planning"
        tabs={ PlanningTabs }
        activeTab={ activeTab }
        onTabPress={ ( tab ) => setActiveTab( tab as PlanningTab ) }
      />
      <View className="flex-1 bg-background">
        {activeTab === PlanningTabs[ 0 ] ? (
          <CalendarSection />
        ) : (
          <HistorySection
            sessions={ sessions }
            isLoading={ isLoadingSession }
            error={ errorLoadingSession ?? undefined }
          />
        )}
      </View>
    </View>
  );
};

export default PlanningScreen;