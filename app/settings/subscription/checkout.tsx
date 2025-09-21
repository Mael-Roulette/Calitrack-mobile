import { StripeProvider } from "@stripe/stripe-react-native";
import React from "react";
import { Text } from "react-native";


const Checkout = () => {
	const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY ?? "";

	return (
		<StripeProvider publishableKey={ publishableKey }>
			<View className='flex-1 px-5 bg-background'>
				<Text>Checkout</Text>
				{/* TODO : Ajouter stripe */ }
			</View>
		</StripeProvider>
	);
};

export default Checkout;
