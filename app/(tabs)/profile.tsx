import PageHeader from "@/components/headers/PageHeader";
import { useAuthStore } from "@/store";
import { ScrollView, Text, View } from "react-native";

const ProfilePage = () => {
  const {
    user,
    isLoading: userInformationsLoading,
    isAuthenticated,
  } = useAuthStore();

  const goToSettings = () => {
    // router.push( "/settings" );
  };

  if ( userInformationsLoading ) {
    return (
      <View className="flex-1">
        <PageHeader title="Mon profil" />
        <View className="flex-1 items-center justify-center">
          <Text>Chargement des informations...</Text>
        </View>
      </View>
    );
  }

  if ( !isAuthenticated || !user ) {
    return null;
  }

  return (
    <View className="flex-1">
      <PageHeader
        title="Mon profil"
        canGoBack={ false }
        onRightPress={ goToSettings }
        rightIcon="settings-sharp"
      />

      <ScrollView className="flex-1 bg-background px-5 pt-5">
        <Text className="title-2">{user.name}</Text>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;
