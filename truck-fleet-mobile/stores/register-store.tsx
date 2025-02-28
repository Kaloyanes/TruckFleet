import {
	Easing,
	type SharedValue,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface RegisterFormData {
	name?: string;
	email?: string;
	password?: string;
	// Add more form fields as needed
}

interface RegisterStore {
	currentIndex: number;
	progress: number;
	formData: RegisterFormData;
	buttonDisabled: boolean;
	setProgress: (progress: number) => void;
	setCurrentIndex: (index: number) => void;
	updateFormData: (data: Partial<RegisterFormData>) => void;
	reset: () => void;
	setButtonDisabled: (disabled: boolean) => void;
}

export const useRegisterStore = create<RegisterStore>()(
	persist(
		(set, get) => ({
			currentIndex: 0,
			buttonDisabled: true,
			progress: 0,
			formData: {},
			setProgress: (progress: number) => set({ progress }),
			setCurrentIndex: (index: number) => set({ currentIndex: index }),
			updateFormData: (data: Partial<RegisterFormData>) =>
				set((state: any) => ({ formData: { ...state.formData, ...data } })),
			reset: () => set({ currentIndex: 0, progress: 0, formData: {} }),
			setButtonDisabled: (disabled: boolean) =>
				set({ buttonDisabled: disabled }),
		}),
		{
			name: "register-storage",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);
