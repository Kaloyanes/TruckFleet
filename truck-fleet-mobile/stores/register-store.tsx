import {
	Easing,
	type SharedValue,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mmkvStorage } from "~/models/MMKVStorage";
import type { ImagePickerAsset } from "expo-image-picker";

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
	profilePicture: ImagePickerAsset | null;
	validPages: boolean[];
	setProgress: (progress: number) => void;
	setCurrentIndex: (index: number) => void;
	updateFormData: (data: Partial<RegisterFormData>) => void;
	reset: () => void;
	setButtonDisabled: (disabled: boolean) => void;
	setProfilePicture: (profilePicture: ImagePickerAsset) => void;
	updateValidPage: (index: number, isValid: boolean) => void;
}

const defaultValues = {
	currentIndex: 0,
	buttonDisabled: true,
	progress: 0,
	formData: {},
	profilePicture: null,
	validPages: [false, false, false], // For 3 steps
};

export const useRegisterStore = create<RegisterStore>((set, get) => ({
	...defaultValues,
	setProgress: (progress: number) => set({ progress }),
	setCurrentIndex: (index: number) =>
		set((state) => ({
			currentIndex: index,
			buttonDisabled: !state.validPages[index],
		})),
	updateFormData: (data: Partial<RegisterFormData>) =>
		set((state: any) => ({ formData: { ...state.formData, ...data } })),
	reset: () => set(defaultValues),
	setButtonDisabled: (disabled: boolean) => set({ buttonDisabled: disabled }),
	setProfilePicture: (profilePicture) => set({ profilePicture }),
	updateValidPage: (index: number, isValid: boolean) =>
		set((state) => {
			const newValidPages = [...state.validPages];
			newValidPages[index] = isValid;
			return {
				validPages: newValidPages,
				buttonDisabled:
					state.currentIndex === index ? !isValid : state.buttonDisabled,
			};
		}),
}));
