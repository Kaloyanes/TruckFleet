import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mmkvStorage } from "~/models/MMKVStorage";
import type { Profile } from "~/models/Profile";

interface ProfileState {
	user: any | null;
	setUser: (user: any) => void;
	clearUser: () => void;
}

export const useProfileStore = create<
	ProfileState,
	[["zustand/persist", ProfileState]]
>(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
			clearUser: () => set({ user: null }),
		}),
		{
			name: "profile-store",
			getStorage: () => mmkvStorage,
		},
	),
);
