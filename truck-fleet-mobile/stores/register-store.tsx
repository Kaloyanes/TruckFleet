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
import { getFirestore } from "@react-native-firebase/firestore";
import Toast from "react-native-toast-message";
import auth, { type FirebaseAuthTypes } from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { MMKV } from "react-native-mmkv";
import { toast } from "sonner-native";

interface RegisterFormData {
	name?: string;
	email?: string;
	password?: string;
	organizationId?: string;
	phone?: string;
}

interface RegisterStore {
	currentIndex: number;
	progress: number;
	formData: RegisterFormData;
	buttonDisabled: boolean;
	profilePicture: ImagePickerAsset | null;
	validPages: number[];
	organizationId: string;
	setProgress: (progress: number) => void;
	setCurrentIndex: (index: number) => void;
	updateFormData: (data: Partial<RegisterFormData>) => void;
	reset: () => void;
	setButtonDisabled: (disabled: boolean) => void;
	setProfilePicture: (profilePicture: ImagePickerAsset) => void;
	updateValidPage: (index: number, isValid: boolean) => void;
	findOrganizationId: (code: string) => Promise<void>;
	register: () => void;
}

const defaultValues = {
	currentIndex: 0,
	buttonDisabled: true,
	progress: 0,
	formData: {},
	profilePicture: null,
	validPages: [],
	organizationId: "",
};

export const useRegisterStore = create<RegisterStore>((set, get) => ({
	...defaultValues,
	setProgress: (progress: number) => set({ progress }),
	setCurrentIndex: (index: number) =>
		set((state) => ({
			currentIndex: index,
			buttonDisabled: !state.validPages.includes(index),
		})),
	updateFormData: (data: Partial<RegisterFormData>) =>
		set((state: any) => ({ formData: { ...state.formData, ...data } })),
	reset: () => set(defaultValues),
	setButtonDisabled: (disabled: boolean) => set({ buttonDisabled: disabled }),
	setProfilePicture: (profilePicture) => set({ profilePicture }),
	updateValidPage: (index: number, isValid: boolean) =>
		set((state) => {
			let newValidPages = [...state.validPages];

			if (isValid && !newValidPages.includes(index)) {
				newValidPages.push(index);
			} else if (!isValid) {
				newValidPages = newValidPages.filter(
					(pageIndex) => pageIndex !== index,
				);
			}

			return {
				validPages: newValidPages,
				buttonDisabled:
					state.currentIndex === index ? !isValid : state.buttonDisabled,
			};
		}),
	findOrganizationId: async (code: string) => {
		// Find organization by code

		if (get().organizationId.trim() !== "") return;

		const docs = await getFirestore()
			.collection("companies")
			.where("companyCode", "==", code)
			.get();

		if (docs.empty) {
			throw new Error("Organization not found");
		}

		const doc = docs.docs[0];

		set({ organizationId: doc.id });
	},
	register: async () => {
		const { formData, profilePicture, organizationId } = get();

		try {
			const user = await auth().createUserWithEmailAndPassword(
				formData.email!,
				formData.password!,
			);

			await user.user.sendEmailVerification();
			toast("Verification email sent");

			// Upload profile picture
			const profilePictureRef = storage().ref(`users/${user.user?.uid}`);

			await profilePictureRef.putFile(profilePicture?.uri!);

			const photoUrl = await profilePictureRef.getDownloadURL();

			// Save user data
			await getFirestore().collection("users").doc(user.user?.uid).set({
				companyId: organizationId,
				email: formData.email,
				name: formData.name,
				phone: formData.phone,
				photoUrl,
				type: "driver",
			});

			// Save user data in MMKV

			const mmkv = new MMKV({
				id: "kaloyanes.user",
			});

			await mmkv.set(
				"user",
				JSON.stringify({
					companyId: organizationId,
					email: formData.email,
					name: formData.name,
					phone: formData.phone,
					photoUrl,
					type: "driver",
				}),
			);

			toast.success("Registered successfully!");
		} catch (e) {
			console.log(e);
			toast.error("An error occurred during registration");
			toast.error(e.message);
		}
	},
}));
