import { Models } from "react-native-appwrite";

export interface User extends Models.Document {
	name: string;
	email: string;
	avatar: string;
	roles: ( "user" | "student" | "coach" )[];
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
