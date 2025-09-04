import { Models } from "react-native-appwrite";

export interface User extends Models.Document {
	name: string;
	email: string;
	avatar: string;
	completedTrainings?: number;
	isPremium?: boolean;
	planId?: string;
	subscriptionStart?: Date;
	subscriptionEnd?: Date;
	subscriptionProvider?: "stripe" | "apple" | "google";
}

export interface CreateUserParams {
	email: string;
	password: string;
	name: string;
}

export interface SignInParams {
	email: string;
	password: string;
}
