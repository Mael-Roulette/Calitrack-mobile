import { signIn } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { validators } from "@/utils/validation";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const SignIn = () => {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ form, setForm ] = useState( { email: "", password: "" } );
  const { fetchAuthenticatedUser } = useAuthStore();

  const submit = async () => {
    if ( isSubmitting ) return;

    const { email, password } = form;

    if ( !validators.email( email ) ) {
      return Alert.alert( "Erreur", "Email invalide" );
    }

    const passwordValidation = validators.password( form.password );
    if ( !passwordValidation.valid ) {
      return Alert.alert( "Erreur", passwordValidation.error );
    }

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
          <TouchableOpacity onPress={ submit } disabled={ isSubmitting } className="btn-secondary">
            <Text className="text-background font-bold text-lg">Connexion</Text>
          </TouchableOpacity>
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