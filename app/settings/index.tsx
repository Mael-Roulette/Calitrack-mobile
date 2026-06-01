import PageHeader from "@/components/headers/PageHeader";
import { deleteAccount } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, router } from "expo-router";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


const Index = () => {
  const { logout, fetchAuthenticatedUser, setIsAuthenticated, setUser } = useAuthStore();

  const handleLogout = async () => {
    Alert.alert(
      "Déconnnexion",
      "Êtes-vous sûr de vouloir vous déconnecter de votre compte ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Continuer",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();
              await fetchAuthenticatedUser();

              router.replace( "/(auth)" );
            } catch ( error ) {
              const errorMessage =
								error instanceof Error ? error.message : String( error );
              Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la déconnexion de votre compte."
              );
              console.error( "Logout account error:", errorMessage );
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Supprimer votre compte",
      "Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();

              setIsAuthenticated( false );
              setUser( null );

              router.replace( "/(auth)" );

              Alert.alert(
                "Compte supprimé",
                "Votre compte a été supprimé avec succès."
              );
            } catch ( error ) {
              const errorMessage =
								error instanceof Error ? error.message : String( error );
              Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la suppression de votre compte."
              );
              console.error( "Delete account error:", errorMessage );
            }
          },
        },
      ]
    );
  };

  return (
    <View className='flex-1'>
      <PageHeader title="Paramètres" />
      <ScrollView>
        <View className='flex-col gap-6 mb-4 pt-5 first:border-t-[1px] first:border-gray-200'>
          { [
            // { title: "Compte", screen: "account" },
            // { title: "Notifications", screen: "notifications" },
            { title: "À propos", screen: "about" },
          ].map( ( item, index ) => (
            <View
              key={ index }
              className='flex-row items-center justify-between pb-4 border-b-[1px] border-gray-200'
            >
              <Link
                href={ `./settings/${item.screen}` }
                style={ { paddingHorizontal: 20, width: "100%" } }
              >
                <View className='flex-row items-center justify-between w-full'>
                  <Text className='title-2' numberOfLines={ 1 }>
                    { item.title }
                  </Text>
                  <Entypo
                    name='chevron-small-right'
                    size={ 24 }
                    color='#132541'
                  />
                </View>
              </Link>
            </View>
          ) ) }
        </View>
        <View className='px-5'>
          <TouchableOpacity
            onPress={ handleLogout }
            className='flex-row items-center py-3'
          >
            <Ionicons name='log-out-outline' size={ 24 } color='#F43F5E' />
            <Text className='ml-3 text-lg text-rose-500 font-medium'>
              Déconnexion
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ handleDeleteAccount }
            className='flex-row items-center py-3 mt-5'
          >
            <Ionicons name='log-out-outline' size={ 24 } color='#9f1239' />
            <Text className='ml-3 text-lg text-rose-800 font-medium'>
              Suppression du compte
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;