export interface PricingPlan {
	id: string;
	name: string;
	price: number;
	currency: string;
	interval: string;
	description?: string;
	features: {
		maxGoals: number;
		maxTrainings: number;
		importExportData: boolean;
		offlineAccess: boolean;
		earlyAccess: boolean;
		// Extensions optionnelles pour compatibilité
		advancedStats?: boolean;
		prioritySupport?: boolean;
		[key: string]: any;
	};
	highlights: string[];
	// Extensions pour la gestion
	badge?: string;
	order?: number;
	isVisible?: boolean;
}

export interface PricingCardProps {
	plan: PricingPlan;
	currentPlan?: string;
	onSelect: (planId: string) => void;
	isLoading?: boolean;
	disabled?: boolean;
}

export type PricingPlans = Record<string, PricingPlan>;
