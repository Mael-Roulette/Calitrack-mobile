import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { createUser } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { validators } from "@/utils/validation";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignUp = () => {
  const [ isSubmitting, setIsSubmitting ] = useState( false );
  const [ form, setForm ] = useState( { name: "", email: "", password: "" } );
  const { fetchAuthenticatedUser } = useAuthStore();

  const submit = async () => {
    const { name, email, password } = form;

    if ( !validators.username( name ) ) {
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
          <CustomInput
            label="Pseudo"
            placeholder="Entrer votre pseudo"
            value={ form.name }
            onChangeText={ ( text: string ) =>
              setForm( ( prev ) => ( { ...prev, name: text } ) )
            }
          />

          <CustomInput
            label="Email"
            placeholder="Entrer votre email"
            value={ form.email }
            onChangeText={ ( text: string ) =>
              setForm( ( prev ) => ( { ...prev, email: text } ) )
            }
            keyboardType='email-address'
          />

          <CustomInput
            label="Mot de passe"
            placeholder="Entrer votre mot de passe"
            secureTextEntry
            value={ form.password }
            onChangeText={ ( text: string ) =>
              setForm( ( prev ) => ( { ...prev, password: text } ) )
            }
          />

          <CustomButton
            title="Inscription"
            onPress={ submit }
            isLoading={ isSubmitting }
            variant="secondary"
          />
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
