import { APP_VERSION } from "@/constants/value";
import Entypo from "@expo/vector-icons/Entypo";
import { Link } from "expo-router";
import {
	ScrollView,
	Text,
	View
} from "react-native";


const Index = () => {

	return (
		<View className='bg-background flex-1'>
			<ScrollView>
				<View className='px-5 py-4'>
					<Text className='text-lg font-calsans text-primary-100'>
						Version : { APP_VERSION }
					</Text>
				</View>
				<View className='flex-col gap-6 mb-4 pt-5 first:border-t-[1px] first:border-gray-200'>
					{ [
						{ title: "Mentions légales", screen: "about/legal-notices" },
						{
							title: "Politique de confidentialité",
							screen: "about/privacy-policy",
						},
						{
							title: "Conditions générales d'utilisation",
							screen: "about/terms-conditions",
						},
						{ title: "Support", screen: "about/support" },
					].map( ( item, index ) => (
						<View
							key={ index }
							className='flex-row items-center justify-between pb-4 border-b-[1px] border-gray-200'
						>
							<Link href={ `./${item.screen}` } style={ { paddingHorizontal: 20 } }>
								<View className='flex-row items-center justify-between w-full'>
									<Text className='text-lg font-calsans text-primary' numberOfLines={ 1 }>
										{ item.title }
									</Text>
									<Entypo
										name='chevron-small-right'
										size={ 24 }
										color='#132541'
									/>
								</View>
							</Link>
						</View>
					) ) }
				</View>
			</ScrollView>
		</View>
	);
};

export default Index;
