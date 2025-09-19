import { StripeProvider } from "@stripe/stripe-react-native";
import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Checkout = () => {
	const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLIC_KEY ?? "";

	return (
		<StripeProvider publishableKey={publishableKey}>
			<SafeAreaView className='flex-1 px-5 bg-background'>
        <Text>Checkout</Text>
				{/* TODO : Ajouter stripe */}
      </SafeAreaView>
		</StripeProvider>
	);
};

export default Checkout;
