import PageHeaderWithTabs from "@/components/headers/PageHeaderWithTabs";
import CalendarSection from "@/components/planning/Calendar";
import HistorySection from "@/components/planning/History";
import useSessionsStore from "@/store/session.store";
import { useEffect, useState } from "react";
import { View } from "react-native";

const PlanningTabs = [ "Historique", "Calendrier" ];

const PlanningScreen = () => {
  const [ activeTab, setActiveTab ] = useState( PlanningTabs[ 0 ] );
  const { sessions, isLoading: isLoadingSession, error: errorLoadingSession, fetchUserSessions } = useSessionsStore();

  useEffect( () => {
    fetchUserSessions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  return (
    <View className="flex-1">
      <PageHeaderWithTabs
        title="Planning"
        tabs={ PlanningTabs }
        activeTab={ activeTab }
        onTabPress={ setActiveTab }
      />
      { activeTab === PlanningTabs[ 0 ] ?
        <HistorySection
          sessions={ sessions }
          isLoading={ isLoadingSession }
          error={ errorLoadingSession ?? undefined }
        />
        :
        <CalendarSection />
      }
    </View>
  );
};

export default PlanningScreen;