import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
import { createUser } from "@/lib/user.appwrite";
import { useAuthStore } from "@/store";

const SignUp = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const { fetchAuthenticatedUser } = useAuthStore();

	const submit = async () => {
		const { name, email, password } = form;

		if (!name || !email || !password)
			return Alert.alert(
				"Erreur",
				"Entrer un pseudo, un email et un mot de passe valide."
			);

		setIsSubmitting(true);

		try {
			await createUser({ email, password, name });
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
			<View className='gap-8 h-100'>
				<Text className='text-3xl font-calsans text-primary'>
					M&apos;inscrire
				</Text>

				<View className='gap-6'>
					<CustomInput
						placeholder='Entrer votre pseudo'
						value={form.name}
						onChangeText={(text: string) =>
							setForm((prev) => ({ ...prev, name: text }))
						}
						label='Pseudo'
					/>
					<CustomInput
						placeholder='Entrer votre email'
						value={form.email}
						onChangeText={(text: string) =>
							setForm((prev) => ({ ...prev, email: text }))
						}
						label='Email'
						keyboardType='email-address'
					/>
					<CustomInput
						placeholder='Entrer votre mot de passe'
						value={form.password}
						onChangeText={(text: string) =>
							setForm((prev) => ({ ...prev, password: text }))
						}
						label='Password'
						secureTextEntry={true}
					/>
					<CustomButton
						title='Inscription'
						onPress={submit}
						isLoading={isSubmitting}
					/>
				</View>
			</View>

			<View className='mt-6 mb-4'>
				<Text className='text-center text-primary font-sregular'>
					Vous avez déjà un compte ?{" "}
					<Link href={'/sign-in'} className='text-secondary'>
						Me connecter
					</Link>
				</Text>
			</View>
		</View>
	);
};

export default SignUp;
