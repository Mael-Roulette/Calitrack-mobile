import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { signIn } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { validators } from "@/utils/validation";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

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
          <CustomInput
            label="Email"
            placeholder="Entrer votre email"
            value={ form.email }
            onChangeText={ ( text: string ) =>
              setForm( ( prev ) => ( { ...prev, email: text } ) )
            }
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
            title="Connexion"
            onPress={ submit }
            isLoading={ isSubmitting }
            variant="secondary"
          />
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