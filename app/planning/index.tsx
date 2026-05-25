import PageHeaderWithTabs from "@/components/headers/PageHeaderWithTabs";
import CalendarSection from "@/components/planning/Calendar";
import HistorySection from "@/components/planning/History";
import { useState } from "react";
import { View } from "react-native";

const PlanningTabs = [ "Historique", "Calendrier" ];

const PlanningScreen = () => {
  const [ activeTab, setActiveTab ] = useState( PlanningTabs[ 0 ] );

  return (
    <View className="flex-1">
      <PageHeaderWithTabs
        title="Planning"
        tabs={ PlanningTabs }
        activeTab={ activeTab }
        onTabPress={ setActiveTab }
      />
      { activeTab === PlanningTabs[ 0 ] ?
        <HistorySection />
        :
        <CalendarSection />
      }
    </View>
  );
};

export default PlanningScreen;