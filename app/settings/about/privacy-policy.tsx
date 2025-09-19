import { LEGAL_CONTENT_UPDATED_AT } from "@/constants/value";
import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicy = () => {
	return (
		<SafeAreaView className='flex-1 px-5 bg-background'>
			<ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
				<Text className='indicator-text mb-4'>
					Dernière mise à jour : {LEGAL_CONTENT_UPDATED_AT}
				</Text>
				<View>
					<Text className='mb-2 text'>
						La présente politique de confidentialité explique comment
						l&apos;application Calitrack (version bêta) collecte, utilise et
						protège les informations personnelles des utilisateurs. Cette
						version bêta est fournie à des fins de test et peut contenir des
						erreurs, des bugs ou des limitations. En participant au programme
						bêta, vous acceptez que certaines fonctionnalités soient incomplètes
						et que des pertes de données puissent survenir.
					</Text>
				</View>
				<View>
					<Text className='title-3 mb-2'>Responsable du traitement</Text>
					<Text className='text mb-2'>Nom : Maël Roulette</Text>
					<Text className='text mb-2'>
						Statut : Développeur indépendant (sans SIRET à ce jour)
					</Text>
					<Text className='text mb-2'>
						Adresse e-mail de contact : calitrack@mael-roulette.fr
					</Text>
					<Text className='text mb-4'>
						Adresse postale : Non communiquée (contact par email uniquement)
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Collecte des données</Text>
					<Text className='text mb-2'>
						Lors de l&apos;utilisation de Calitrack, nous pouvons collecter les
						données suivantes :
					</Text>
					<Text className='text mb-2'>• Pseudo (obligatoire)</Text>
					<Text className='text mb-2'>• Adresse email (obligatoire)</Text>
					<Text className='text mb-2'>
						• Nombre d&apos;entrainements effectués
					</Text>
					<Text className='text mb-2'>
						• Objecitfs et entrainements associés
					</Text>
					<Text className='text mb-4'>
						Ces données sont nécessaires pour le fonctionnement de l’application
						et l’expérience utilisateur.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Finalité du traitement</Text>
					<Text className='text mb-2'>
						Les données collectées sont utilisées pour :
					</Text>
					<Text className='text mb-2'>
						• Fournir les fonctionnalités de suivi d&apos;objectifs et
						d&apos;entraînements
					</Text>
					<Text className='text mb-2'>
						• Afficher vos statistiques personnelles
					</Text>
					<Text className='text mb-2'>
						• Améliorer l&apos;application lors de la phase bêta
					</Text>
					<Text className='text mb-4'>
						• Préparer des fonctionnalités futures
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Base légale</Text>
					<Text className='text mb-2'>
						Le traitement des données repose sur :
					</Text>
					<Text className='text mb-4'>
						• Votre consentement lors de l&apos;inscription et de
						l&apos;utilisation de l&apos;application
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Hébergement et stockage</Text>
					<Text className='text mb-4'>
						Vos données sont hébergées via Appwrite, service de backend
						sécurisé.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Partage des données</Text>
					<Text className='text mb-2'>
						Vos données ne sont pas revendues ni partagées avec des tiers, sauf
						pour :
					</Text>
					<Text className='text mb-4'>
						• L&apos;hébergement et le stockage (Appwrite)
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Durée de conservation</Text>
					<Text className='text mb-4'>
						Les données sont conservées tant que votre compte est actif. Vous
						pouvez demander la suppression de votre compte et de vos données à
						tout moment (voir section &quot;Vos Droits&quot;).
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Sécurité</Text>
					<Text className='text mb-2'>
						Des mesures techniques et organisationnelles sont mises en place
						pour protéger vos données contre tout accès non autorisé.
					</Text>
					<Text className='text mb-4'>
						⚠️ En phase bêta, nous ne pouvons garantir l&apos;absence totale de
						failles ou de pertes de données.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Vos droits</Text>
					<Text className='text mb-2'>
						Conformément au RGPD, vous disposez des droits suivants :
					</Text>
					<Text className='text mb-2'>• Accès à vos données</Text>
					<Text className='text mb-2'>• Rectification</Text>
					<Text className='text mb-2'>• Suppression</Text>
					<Text className='text mb-2'>• Portabilité</Text>
					<Text className='text mb-2'>• Retrait de consentement</Text>
					<Text className='text mb-4'>
						Pour exercer vos droits : calitrack@mael-roulette.fr
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Modifications</Text>
					<Text className='text mb-2'>
						Cette politique peut être modifiée à tout moment. Les changements
						seront communiqués via l&apos;application.
					</Text>
				</View>

				<View>
					<Text className='title-3 mb-2'>Version bêta — Clause spéciale</Text>
					<Text className='text mb-2'>
						• Certaines fonctionnalités peuvent être limitées ou absentes
					</Text>
					<Text className='text mb-2'>
						• Les données saisies peuvent être perdues lors des mises à jour
					</Text>
					<Text className='text mb-4'>
						• Cette version n&apos;est pas représentative de la version finale
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
};

export default PrivacyPolicy;
