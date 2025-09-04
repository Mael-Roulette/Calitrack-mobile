import {
	Account,
	Avatars,
	Client,
	Databases,
	Functions
} from "react-native-appwrite";

export const appwriteConfig = {
	endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
	projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
	platform: "com.calitrack.sportapp",
	databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
	userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
	goalCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GOAL_COLLECTION_ID!,
	trainingCollectionId:
		process.env.EXPO_PUBLIC_APPRWITE_TRAINING_COLLECTION_ID!,
	exerciseCollectionId:
		process.env.EXPO_PUBLIC_APPWRITE_EXERCISE_COLLECTION_ID!,
	typeCollectionId: process.env.EXPO_PUBLIC_APPWRITE_TYPE_COLLECTION_ID!,
	passwordRedirectUrl: process.env.EXPO_PUBLIC_APPWRITE_PASSWORD_REDIRECT_URL!,
	deleteAccountFunctionId: process.env.EXPO_PUBLIC_APPWRITE_DELETE_ACCOUNT_FUNCTION_ID!,
};

export const client = new Client();

client
	.setEndpoint(appwriteConfig.endpoint)
	.setProject(appwriteConfig.projectId)
	.setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const functions = new Functions(client);
