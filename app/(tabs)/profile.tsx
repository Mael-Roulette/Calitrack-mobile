import PageHeader from "@/components/headers/PageHeader";
import PrimaryGradient from "@/components/ui/PrimaryGradient";
import { useUserActions } from "@/hooks/actions/useUserActions";
import { useMonthlySessionStats } from "@/hooks/time/useMonthSessions";
import { createFile } from "@/lib/bucket.appwrite";
import { useAuthStore } from "@/store";
import { formatSecondsDuration } from "@/utils/string";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const ProfilePage = () => {
  const {
    user,
    isLoading: userInformationsLoading,
    isAuthenticated,
  } = useAuthStore();
  const { count: monthlySessionCount, totalSeconds } = useMonthlySessionStats();
  const { handleUpdateName, isUpdatingName, handleUpdateAvatar } = useUserActions();

  const [ isEditing, setIsEditing ] = useState( false );
  const [ editName, setEditName ] = useState( user?.name ?? "" );

  const goToSettings = () => router.push( "../settings/" );

  const handleCancelEdit = () => {
    setEditName( user?.name ?? "" );
    setIsEditing( false );
  };

  const handleConfirmName = async () => {
    const result = await handleUpdateName( editName );
    if ( result?.success ) {
      setIsEditing( false );
    }
  };

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync( {
      mediaTypes: [ "images" ],
      allowsEditing: true,
      quality: 0.7,
      aspect: [ 1, 1 ],
    } );
    if ( result.canceled ) return;

    try {
      const createdFile = await createFile( { image: result.assets[ 0 ], user: user! } );
      await handleUpdateAvatar( createdFile.fileUrl );
    } catch ( err ) {
      console.error( "Upload failed:", err );
    }
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

  if ( !isAuthenticated || !user ) return null;

  return (
    <View className="flex-1">
      <PageHeader
        title="Mon profil"
        canGoBack={ false }
        onRightPress={ goToSettings }
        rightIcon="settings-sharp"
      />

      <ScrollView className="flex-1 bg-background px-5 pt-5">
        <View className="relative flex-col items-center gap-4 mb-8">
          <TouchableOpacity
            className="min-h-10 py-2 px-3 rounded-full bg-secondary
                      flex-row items-center gap-3
                      absolute top-0 right-0"
            onPress={ isEditing ? handleCancelEdit : () => setIsEditing( true ) }
          >
            {!isEditing && <Feather name="edit-3" size={ 20 } color="#FFF9F7" />}
            <Text className="text-background">{isEditing ? "Retour" : "Éditer"}</Text>
          </TouchableOpacity>

          {!isEditing ? (
            <>
              <Image
                style={ { width: 80, height: 80, borderRadius: 50 } }
                source={ user.avatar }
              />
              <View className="flex-col items-center gap-3">
                <Text className="title-2">{user.name}</Text>
              </View>
            </>
          ) : (
            <View className="flex-col items-center gap-3">
              <TouchableOpacity onPress={ handlePickAvatar } className="relative">
                <Image
                  style={ { width: 80, height: 80, borderRadius: 50 } }
                  source={ user.avatar }
                />
                <Feather name="edit-3" size={ 20 } color="#FFF9F7" className="absolute -top-1 -right-1 bg-secondary rounded-full p-2" />
              </TouchableOpacity>
              <View className="w-full flex-row gap-2">
                <TextInput
                  className="custom-input flex-1"
                  value={ editName }
                  onChangeText={ setEditName }
                  placeholder={ user.name }
                  placeholderTextColor="#617188"
                />
                <TouchableOpacity
                  className="bg-secondary px-5 py-3 flex items-center justify-center rounded-lg"
                  onPress={ handleConfirmName }
                  disabled={ isUpdatingName }
                >
                  {isUpdatingName
                    ? <ActivityIndicator size="small" color="#FFF9F7" />
                    : <Text className="text-background font-semibold">OK</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <PrimaryGradient>
          <View className="p-5">
            <Text className="title text-background mb-4">Stats du mois</Text>
            <View className="flex-row gap-4">
              <View className="bg-background/20 rounded-lg p-4 flex-col items-center justify-center gap-1 flex-1">
                <Text className="text-3xl font-bold text-background">{monthlySessionCount}</Text>
                <Text className="text-background text-lg text-center">Séance(s) réalisée(s)</Text>
              </View>
              <View className="bg-background/20 rounded-lg p-4 flex-col items-center justify-center gap-1 flex-1">
                <Text className="text-3xl font-bold text-background">{formatSecondsDuration( totalSeconds, true, false )}</Text>
                <Text className="text-background text-lg text-center">Heure(s) d&apos;entraînement</Text>
              </View>
            </View>
          </View>
        </PrimaryGradient>
      </ScrollView>
    </View>
  );
};

export default ProfilePage;