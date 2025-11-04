import useAuthStore from "@/store/auth.store";
import { Redirect, Slot } from "expo-router";
import {
	Dimensions,
	Image,
	KeyboardAvoidingView,
	ScrollView,
	View
} from "react-native";
import Svg, { Path } from "react-native-svg";

const AuthLayout = () => {
	const { isAuthenticated } = useAuthStore();

	if ( isAuthenticated ) return <Redirect href={ '/(tabs)' } />;
	const { width } = Dimensions.get( "screen" );
	const height = 35;

	return (
		<KeyboardAvoidingView
			behavior="padding"
			style={ { backgroundColor: "#FFF9F7" } }
		>
			<ScrollView
				className='bg-background h-full'
				keyboardShouldPersistTaps='handled'
			>
				<View
					className='bg-primary overflow-hidden'
					style={ { height: Dimensions.get( "screen" ).height / 3 } }
				>
					<View className='justify-center items-center flex-1 mt-16'>
						<Image
							source={ require( "../../assets/images/logo.png" ) }
							style={ { width: 180, height: 100 } }
							resizeMode='contain'
						/>
					</View>

					<Svg width={ width } height={ height } viewBox={ `0 0 ${width} ${height}` }>
						<Path
							d={ `M0,${height} Q${width / 2},0 ${width},${height} L${width},${height * 2} L0,${height * 2} Z` }
							fill='#FFF9F7'
						/>
					</Svg>
				</View>
				<Slot />
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default AuthLayout;
