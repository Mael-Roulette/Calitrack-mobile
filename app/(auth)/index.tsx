import CustomButton from "@/components/ui/CustomButton";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Index = () => {
  const signin = () => {
    router.push( "/sign-in" );
  };

  const signup = () => {
    router.push( "/sign-up" );
  };

  return (
    <View className='px-5 py-10 bg-background flex-1'>
      <View className='mb-14 gap-4'>
        <Text className='title text-center'>
          Bienvenue sur <Text className='text-secondary'>Calitrack</Text>
        </Text>
        <Text className='text text-center'>
          Un seul endroit pour suivre vos séances, progresser et rester motivé
        </Text>
      </View>

      <View className='gap-4 mb-14'>
        <CustomButton
          title="Connexion"
          onPress={ signin }
          variant="secondary"
        />

        <CustomButton
          title="Inscription"
          onPress={ signup }
        />
      </View>
    </View>
  );
};

export default Index;
