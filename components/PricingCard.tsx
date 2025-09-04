import { PricingCardProps } from "@/types";
import { PlanManager } from "@/constants/premiumPlan";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

const PricingCard: React.FC<PricingCardProps> = ({
	plan,
	currentPlan,
	onSelect,
	isLoading = false,
	disabled = false,
}) => {
	const isCurrentPlan = currentPlan === plan.id;
	const isFree = plan.price === 0;

	const getButtonConfig = () => {
		if (isCurrentPlan) {
			return { text: "Plan actuel", disabled: true, style: "current" };
		}

		if (isFree) {
			return { text: "Continuer gratuitement", disabled: false, style: "free" };
		}

		if (currentPlan === "free") {
			return { text: "Indisponible", disabled: false, style: "upgrade" };
			// return { text: "Passer au premium", disabled: false, style: "upgrade" };
		}

		if (PlanManager.canUpgradeTo(currentPlan || "free", plan.id)) {
			return { text: "Indisponible", disabled: false, style: "upgrade" };
			// return { text: "Passer à ce plan", disabled: false, style: "upgrade" };
		}

		return { text: "Changer de plan", disabled: false, style: "change" };
	};

	const getFeatureIcon = (value: any) => {
		if (typeof value === "number") {
			if (value === -1) {
				return <Ionicons name='infinite' size={16} color='#10B981' />;
			}
			return value > 0 ? (
				<Ionicons name='checkmark-circle' size={16} color='#10B981' />
			) : (
				<Ionicons name='close-circle' size={16} color='#EF4444' />
			);
		}

		if (typeof value === "boolean") {
			return (
				<Ionicons
					name={value ? "checkmark-circle" : "close-circle"}
					size={16}
					color={value ? "#10B981" : "#EF4444"}
				/>
			);
		}

		const hasFeature = !!value;
		return (
			<Ionicons
				name={hasFeature ? "checkmark-circle" : "close-circle"}
				size={16}
				color={hasFeature ? "#10B981" : "#EF4444"}
			/>
		);
	};

	const formatFeatureLabel = (key: string, value: any): string => {
		switch (key) {
			case "maxGoals":
				return value === -1 ? "Objectifs illimités" : `${value} objectifs max`;
			case "maxTrainings":
				return value === -1
					? "Entraînements illimités"
					: `${value} entraînements max`;
			case "importExportData":
				return "Import / Export des données";
			case "offlineAccess":
				return "Accès hors ligne";
			case "earlyAccess":
				return "Accès anticipé aux nouvelles fonctionnalités";
			case "advancedStats":
				return "Statistiques avancées";
			case "prioritySupport":
				return "Support prioritaire";
			default:
				return key;
		}
	};

	const renderFeatures = () => {
		return Object.entries(plan.features).map(([key, value]) => {
			const hasFeature = PlanManager.hasFeature(plan.id, key);

			return (
				<View key={key} className='flex-row items-center gap-3 mb-2'>
					{getFeatureIcon(value)}
					<Text
						className={`font-sregular flex-1 ${
							hasFeature ? "text-primary" : "text-primary-100"
						}`}
					>
						{formatFeatureLabel(key, value)}
					</Text>
				</View>
			);
		});
	};

	const renderPrice = () => {
		if (isFree) {
			return (
				<Text className='font-calsans text-4xl text-secondary'>Gratuit</Text>
			);
		}

		const intervalText =
			plan.interval === "monthly"
				? "/mois"
				: plan.interval === "yearly"
					? "/an"
					: plan.interval
						? `/${plan.interval}`
						: "";

		return (
			<View className='flex-row items-baseline gap-1'>
				<Text className='font-calsans text-4xl text-secondary'>
					{plan.price.toFixed(plan.price % 1 === 0 ? 0 : 2)}€
				</Text>
				{intervalText && (
					<Text className='font-sregular text-primary-100'>{intervalText}</Text>
				)}
			</View>
		);
	};

	const buttonConfig = getButtonConfig();

	return (
		<View className='relative p-6 bg-background border border-secondary rounded-md'>
			{/* Badge */}
			{(isCurrentPlan || plan.badge) && (
				<View className='absolute -top-3 right-4 z-10'>
					<View
						className={`px-3 py-1 rounded-full ${
							isCurrentPlan
								? "bg-green-500"
								: plan.badge === "POPULAIRE"
									? "bg-orange-500"
									: "bg-blue-500"
						}`}
					>
						<Text className='text-white font-semibold text-xs'>
							{isCurrentPlan ? "✓ ACTUEL" : plan.badge}
						</Text>
					</View>
				</View>
			)}

			{/* Header */}
			<View className='mb-6'>
				<Text className='font-calsans text-2xl text-primary mb-2'>
					{plan.name}
				</Text>

				<View className='mb-2'>{renderPrice()}</View>

				{plan.description && (
					<Text className='text-primary-100 font-sregular'>
						{plan.description}
					</Text>
				)}
			</View>

			{/* Highlights */}
			{plan.highlights && plan.highlights.length > 0 && (
				<View className='mb-6'>
					{plan.highlights.map((highlight, index) => (
						<View key={index} className='flex-row items-center gap-3 mb-2'>
							<Ionicons name='star' size={16} color='#FC7942' />
							<Text className='font-semibold text-primary'>{highlight}</Text>
						</View>
					))}
				</View>
			)}

			{/* Features */}
			<View className='mb-8'>
				<Text className='font-semibold text-primary mb-4'>
					Fonctionnalités incluses :
				</Text>
				{renderFeatures()}
			</View>

			{/* Action Button */}
			<TouchableOpacity
				onPress={() =>
					!buttonConfig.disabled && !isLoading && onSelect(plan.id)
				}
				disabled={buttonConfig.disabled || isLoading || disabled}
				activeOpacity={0.8}
				className={`w-full py-4 rounded-xl ${
					buttonConfig.disabled || isCurrentPlan
						? "bg-gray-200 border border-gray-300"
						: isLoading || disabled
							? "bg-gray-100 border border-gray-200"
							: "bg-secondary"
				}`}
			>
				{isLoading ? (
					<ActivityIndicator
						color={
							buttonConfig.disabled || isCurrentPlan ? "#6B7280" : "#FFF9F7"
						}
					/>
				) : (
					<Text
						className={`text-center font-semibold ${
							buttonConfig.disabled || isCurrentPlan
								? "text-gray-600"
								: "text-background"
						}`}
					>
						{buttonConfig.text}
					</Text>
				)}
			</TouchableOpacity>
		</View>
	);
};

export default PricingCard;
