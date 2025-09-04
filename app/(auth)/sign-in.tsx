import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import { signIn } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

const SignIn = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState({ email: "", password: "" });
	const { fetchAuthenticatedUser } = useAuthStore();

	const submit = async () => {
		if (isSubmitting) return;

		const { email, password } = form;

		if (!email || !password)
			return Alert.alert(
				"Erreur",
				"Entrer un email et un mot de passe valide."
			);

		setIsSubmitting(true);

		try {
			await signIn({ email, password });
			await fetchAuthenticatedUser();

			router.replace("/");
		} catch (error: any) {
			Alert.alert("Error", error.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View className='px-5 py-10'>
			<View className='gap-8'>
				<Text className='text-3xl font-calsans text-primary'>Me connecter</Text>

				<View className='gap-6'>
					<CustomInput
						placeholder='Entrer votre email'
						value={form.email}
						onChangeText={(text: string) =>
							setForm((prev) => ({ ...prev, email: text }))
						}
						label='Email'
						keyboardType='email-address'
					/>

					<View className='gap-2'>
						<CustomInput
							placeholder='Entrer votre mot de passe'
							value={form.password}
							onChangeText={(text: string) =>
								setForm((prev) => ({ ...prev, password: text }))
							}
							label='Password'
							secureTextEntry={true}
						/>
					</View>
					<CustomButton
						title='Connexion'
						onPress={submit}
						isLoading={isSubmitting}
					/>
				</View>
			</View>

			<View className='mt-6 mb-4'>
				<Text className='text-center text-primary font-sregular'>
					Vous n&apos;avez pas encore de compte ?{" "}
					<Link href={'/sign-up'} className='text-secondary'>
						S&apos;inscrire
					</Link>
				</Text>
			</View>
		</View>
	);
};

export default SignIn;