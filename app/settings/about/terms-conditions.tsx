import { LEGAL_CONTENT_UPDATED_AT } from "@/constants/value";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TermsCondition = () => {
	return (
		<SafeAreaView className='flex-1 px-5 bg-background'>
			<ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
				<Text className='indicator-text mb-4'>
					Dernière mise à jour : {LEGAL_CONTENT_UPDATED_AT}
				</Text>
				<View>
					<Text className='text mb-2'>
						Éditeur : Calitrack, développé par Maël Roulette
					</Text>
					<Text className='text mb-2'>
						Contact : calitrack@mael-roulette.fr
					</Text>
					<Text className='text mb-4'>Version : Bêta - 2025</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Présentation du service</Text>
					<Text className='text mb-2'>
						Calitrack est une application permettant de se fixer des objectifs
						et de créer des entraînements personnalisés pour le street workout
						afin de suivre ses performances. L&apos;application est en version
						bêta, elle peut donc contenir des bugs et certaines fonctionnalités
						peuvent évoluer ou être supprimées sans préavis.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>
						Inscription et compte utilisateur
					</Text>
					<Text className='text mb-4'>
						Pour utiliser Calitrack, l&apos;utilisateur doit fournir un pseudo
						et un email valide. L&apos;inscription implique l&apos;acceptation
						des présentes CGU.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>
						Utilisation autorisée et interdite
					</Text>
					<Text className='text mb-2'>
						L&apos;utilisateur s&apos;engage à utiliser l&apos;application de
						manière personnelle et conforme à la loi.
					</Text>
					<Text className='text mb-4'>
						Interdiction : utilisation frauduleuse, modification ou détournement
						de l&apos;application.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Données personnelles</Text>
					<Text className='text mb-4'>
						Calitrack collecte et utilise les données suivantes : pseudo, email,
						entraînements et objectifs. Ces données sont utilisées uniquement
						pour le fonctionnement de l&apos;application et le suivi des
						performances de l&apos;utilisateur.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Propriété intellectuelle</Text>
					<Text className='text mb-2'>
						Tout le contenu de Calitrack (design, textes, fonctionnalités, logo)
						est la propriété exclusive de Calitrack. Toute reproduction ou
						utilisation non autorisée est interdite.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Limitation de responsabilité</Text>
					<Text className='text mb-4'>
						L&apos;application est fournie &quot;telle quelle&quot; en version
						bêta. Des bugs, pertes de données ou interruptions de service
						peuvent survenir. L&apos;utilisateur utilise l&apos;application à
						ses risques et périls.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>
						Évolution de l&apos;application et modifications des CGU
					</Text>
					<Text className='text mb-2'>
						Calitrack peut évoluer et modifier ses fonctionnalités à tout
						moment. Les présentes CGU peuvent également être modifiées sans
						préavis.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Loi applicable</Text>
					<Text className='text mb-2'>
						Les présentes CGU sont régies par le droit français.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default TermsCondition;