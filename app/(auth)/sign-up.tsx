import { createUser } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { validators } from "@/utils/validation";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

const SignUp = () => {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ form, setForm ] = useState( { name: "", email: "", password: "" } );
  const { fetchAuthenticatedUser } = useAuthStore();

  const submit = async () => {
    const { name, email, password } = form;

    if ( !validators.exerciseName( name ) ) {
      return Alert.alert( "Erreur", "Le pseudo doit contenir entre 3 et 50 caractères" );
    }

    if ( !validators.email( email ) ) {
      return Alert.alert( "Erreur", "Email invalide" );
    }

    const passwordValidation = validators.password( password );
    if ( !passwordValidation.valid ) {
      return Alert.alert( "Erreur", passwordValidation.error );
    }

    setIsSubmitting( true );

    try {
      await createUser( { email, password, name } );
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
      <View className='gap-8 h-100'>
        <Text className='title'>
          M&apos;inscrire
        </Text>

        <View className='gap-6'>
          <View className="gap-2">
            <Text className="text">Pseudo</Text>
            <TextInput
              placeholder='Entrer votre pseudo'
              value={ form.name }
              onChangeText={ ( text: string ) =>
                setForm( ( prev ) => ( { ...prev, name: text } ) )
              }
              className="custom-input"
            />
          </View>

          <View className="gap-2">
            <Text className="text">Email</Text>
            <TextInput
              placeholder='Entrer votre email'
              value={ form.email }
              onChangeText={ ( text: string ) =>
                setForm( ( prev ) => ( { ...prev, email: text } ) )
              }
              keyboardType='email-address'
              className="custom-input"
            />
          </View>

          <View className="gap-2">
            <Text className="text">Mot de passe</Text>
            <TextInput
              placeholder='Entrer votre mot de passe'
              value={ form.password }
              onChangeText={ ( text: string ) =>
                setForm( ( prev ) => ( { ...prev, password: text } ) )
              }
              secureTextEntry={ true }
              className="custom-input"
            />
          </View>

          <TouchableOpacity onPress={ submit } disabled={ isSubmitting } className="btn-secondary">
            <Text className="text-background font-bold text-lg">Inscription</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className='mt-6 mb-4'>
        <Text className='text-center text'>
          Vous avez déjà un compte ?{" "}
          <Link href={ "/sign-in" } className='text-secondary font-bold'>
            Me connecter
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default SignUp;
