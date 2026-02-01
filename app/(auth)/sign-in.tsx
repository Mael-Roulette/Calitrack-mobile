import { signIn } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

const SignIn = () => {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ form, setForm ] = useState( { email: "", password: "" } );
  const { fetchAuthenticatedUser } = useAuthStore();

  const submit = async () => {
    if ( isSubmitting ) return;

    const { email, password } = form;

    if ( !email || !password )
      return Alert.alert(
        "Erreur",
        "Entrer un email et un mot de passe valide."
      );

    setIsSubmitting( true );

    try {
      await signIn( { email, password } );
      await fetchAuthenticatedUser();

      router.replace( "/" );
    } catch ( error: any ) {
      Alert.alert( "Error", error.message );
    } finally {
      setIsSubmitting( false );
    }
  };

  return (
    <View className='px-5 py-10'>
      <View className='gap-8'>
        <Text className='title'>Me connecter</Text>

        <View className='gap-6'>
          <View className='gap-2'>
            <Text className="text">Email</Text>
            <TextInput
              placeholder='Entrer votre email'
              value={ form.email }
              onChangeText={ ( text: string ) =>
                setForm( ( prev ) => ( { ...prev, email: text } ) )
              }
              keyboardType='email-address'
              className="custom-input"
              autoCapitalize="none"
            />
          </View>

          <View className='gap-2'>
            <Text className="text">Mot de passe</Text>
            <TextInput
              placeholder='Entrer votre mot de passe'
              value={ form.password }
              onChangeText={ ( text: string ) =>
                setForm( ( prev ) => ( { ...prev, password: text } ) )
              }
              secureTextEntry
              className="custom-input text-primary"
            />
          </View>
          <Pressable onPress={ submit } disabled={ isSubmitting } className="btn-secondary">
            <Text className="text-background font-bold text-lg">Connexion</Text>
          </Pressable>
        </View>
      </View>

      <View className='mt-6 mb-4'>
        <Text className='text-center text'>
          Vous n&apos;avez pas encore de compte ?{" "}
          <Link href={ "/sign-up" } className='text-secondary font-bold'>
            S&apos;inscrire
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default SignIn;