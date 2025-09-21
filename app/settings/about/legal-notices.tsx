import { LEGAL_CONTENT_UPDATED_AT } from "@/constants/value";
import React from "react";
import { ScrollView, Text, View } from "react-native";


const LegalNotices = () => {
	return (
		<View className='flex-1 px-5 bg-background'>
			<ScrollView contentContainerStyle={ { paddingBottom: 16 } }>
				<View>
					<Text className='indicator-text'>
						Dernière mise à jour : { LEGAL_CONTENT_UPDATED_AT }
					</Text>
				</View>

				<View className='mt-4'>
					<Text className='title-2'>Éditeur de l&apos;application</Text>
					<Text className='mt-2 text'>
						• Nom de l&apos;application : Calitrack
					</Text>
					<Text className='mt-2 text'>• Éditeur : Maël Roulette</Text>
					<Text className='mt-2 text'>
						• Contact : calitrack@mael-roulette.fr
					</Text>
					<Text className='mt-2 text'>• Statut : Développeur individuel</Text>
					<Text className='mt-2 text'>
						• Hébergement des données : Appwrite
					</Text>
					<Text className='indicator-text mt-2'>
						Calitrack est éditée à titre personnel. En l&apos;absence
						d&apos;immatriculation (SIRET), cette application ne peut pas être
						considérée comme une activité commerciale tant qu&apos;aucune
						monétisation effective n&apos;est mise en place.
					</Text>
				</View>

				<View className='mt-4'>
					<Text className='title-2'>Propriété intellectuelle</Text>
					<Text className='text mt-2'>
						L&apos;ensemble des contenus présents dans l&apos;application
						(textes, logo, éléments graphiques) est la propriété exclusive de
						Maël Roulette, sauf mention contraire. Toute reproduction ou
						réutilisation est interdite sans autorisation préalable.
					</Text>
				</View>

				<View className='mt-4'>
					<Text className='title-2'>Données personnelles</Text>

					<Text className='title-3 mt-3'>Données collectées</Text>
					<Text className='mt-2 text'>• Pseudo (obligatoire)</Text>
					<Text className='mt-2 text'>• Adresse e-mail (obligatoire)</Text>
					<Text className='mt-2 text'>• Photo de profil (facultative)</Text>
					<Text className='mt-2 text'>
						• Nombre d&apos;entraînements réalisés
					</Text>
					<Text className='mt-2 text'>
						• Objectifs et entraînements associés au profil
					</Text>
					<Text className='mt-2 text'>
						Ces données sont utilisées uniquement pour fournir les
						fonctionnalités de l&apos;application et améliorer
						l&apos;expérience. Aucune donnée n&apos;est revendue. Elles peuvent
						être traitées par des prestataires nécessaires au fonctionnement du
						service.
					</Text>

					<Text className='title-3 mt-4'>Base légale</Text>
					<Text className='mt-2 text'>
						Le traitement repose sur votre consentement et sur l&apos;exécution
						du contrat (fourniture du service).
					</Text>

					<Text className='title-3 mt-4'>Hébergement & sécurité</Text>
					<Text className='mt-2 text'>
						Les données sont hébergées via Appwrite. Des mesures techniques et
						organisationnelles raisonnables sont mises en œuvre pour protéger
						vos informations contre l&apos;accès non autorisé, la perte ou
						l&apos;altération.
					</Text>

					<Text className='title-3 mt-4'>Services tiers</Text>
					<Text className='mt-2 text'>
						• Appwrite : authentification, base de données, stockage
					</Text>
					<Text className='mt-2 text'>
						• Stripe (à venir) : gestion des paiements pour l&apos;offre Premium
					</Text>

					<Text className='title-3 mt-4'>Durée de conservation</Text>
					<Text className='mt-2 text'>
						Les données sont conservées tant que votre compte est actif. Vous
						pouvez demander la suppression de votre compte et de vos données à
						tout moment (voir &quot;Vos droits&quot;).
					</Text>

					<Text className='title-3 mt-4'>Vos droits (RGPD)</Text>
					<Text className='mt-2 text'>
						Vous disposez d&apos;un droit d&apos;accès, de rectification, de
						suppression, de portabilité, ainsi que du droit de retirer votre
						consentement. Pour exercer vos droits, contactez&nbsp;
						<Text className='text underline'>calitrack@mael-roulette.fr</Text>.
					</Text>

					<Text className='title-3 mt-4'>Version bêta</Text>
					<Text className='mt-2 text'>
						Cette version bêta peut comporter des limitations, des bugs et des
						pertes de données. Certaines fonctionnalités peuvent être
						incomplètes ou amenées à évoluer.
					</Text>
				</View>

				<View className='mt-4 mb-10'>
					<Text className='title-2'>Contact</Text>
					<Text className='text mt-2'>
						Pour toute question relative à l&apos;application ou à vos données :{ " " }
						<Text className='underline'>calitrack@mael-roulette.fr</Text>
					</Text>
				</View>
			</ScrollView>
		</View>
	);
};

export default LegalNotices;
