import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

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
        <Pressable onPress={ signin } className="btn-secondary">
          <Text className="text-background font-bold text-lg">Connexion</Text>
        </Pressable>

        <Pressable onPress={ signup } className="btn-primary">
          <Text className="text-secondary font-bold text-lg">Inscription</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Index;
