import { logout as appwriteLogout, getCurrentUser } from "@/lib/user.appwrite";
import { User } from "@/types";
import { create } from "zustand";

type AuthState = {
	isAuthenticated: boolean;
	user: User | null;
	isLoading: boolean;

	setIsAuthenticated: (value: boolean) => void;
	setUser: (user: User | null) => void;
	setLoading: (loading: boolean) => void;

	fetchAuthenticatedUser: () => Promise<void>;
	refreshUser: () => Promise<void>;
	logout: () => Promise<void>;
};

const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: false,
	user: null,
	isLoading: true,

	setIsAuthenticated: (value) => set({ isAuthenticated: value }),
	setUser: (user) => set({ user }),
	setLoading: (value) => set({ isLoading: value }),

	fetchAuthenticatedUser: async () => {
		set({ isLoading: true });

		try {
			const user = await getCurrentUser();

			if (user) {
				set({ isAuthenticated: true, user });
			} else {
				set({ isAuthenticated: false, user: null });
			}
		} catch {
			set({ isAuthenticated: false, user: null });
		} finally {
			set({ isLoading: false });
		}
	},

	refreshUser: async () => {
		const currentUser = await getCurrentUser();
		set({ user: currentUser });
	},

	logout: async () => {
		try {
			await appwriteLogout();
			set({ isAuthenticated: false, user: null, isLoading: false });
		} catch (error) {
			console.error("Logout error:", error);
		}
	},
}));

export default useAuthStore;
