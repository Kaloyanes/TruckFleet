import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { create } from "zustand";

interface CompanyState {
	// Company details
	name: string;
	personInCharge: string;
	ownerEmail: string;
	phone: string;
	address: string;
	country: string; // Add this line

	// Invoice details
	iban: string;
	bank: string;
	bankCode: string;
	vatNumber: string;

	// State
	isLoading: boolean;
	hasEdited: boolean;

	originalData: Partial<{
		name: string;
		personInCharge: string;
		ownerEmail: string;
		phone: string;
		address: string;
		country: string; // Add this line
		iban: string;
		bank: string;
		bankCode: string;
		vatNumber: string;
	}>;

	// Actions
	setField: (field: keyof CompanyStateData, value: string) => void;
	reset: () => void;
	load: (userId: string) => Promise<void>;
	save: (userId: string) => Promise<void>;
}

type CompanyStateData = Omit<
	CompanyState,
	| "setField"
	| "reset"
	| "load"
	| "save"
	| "originalData"
	| "isLoading"
	| "hasEdited"
>;

const initialState = {
	name: "",
	personInCharge: "",
	ownerEmail: "",
	phone: "",
	address: "",
	country: "",
	iban: "",
	bank: "",
	bankCode: "",
	vatNumber: "",
	isLoading: true,
	hasEdited: false,
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
	...initialState,
	originalData: initialState,

	setField: (field: keyof CompanyStateData, value: string) => {
		set({
			[field]: value,
			hasEdited: get().originalData[field] !== value,
		});
	},

	reset: () => set({ ...initialState }),

	load: async (userId: string) => {
		set({ isLoading: true });
		try {
			const docRef = doc(db, "users", userId);
			const docSnap = await getDoc(docRef);
			console.log("Loading company data for:", userId);

			if (docSnap.exists()) {
				const data = docSnap.data();
				console.log("Found company data:", data);
				set({
					...data,
					originalData: { ...data },
					isLoading: false,
					hasEdited: false,
				});
			} else {
				console.warn("No company document found");
				set({ ...initialState, isLoading: false });
			}
		} catch (error) {
			console.error("Error loading company data:", error);
			set({ ...initialState, isLoading: false });
		}
	},

	save: async (userId: string) => {
		const state = get();
		const {
			isLoading,
			load,
			save,
			setField,
			reset,
			hasEdited,
			originalData,
			...data
		} = state;

		try {
			const docRef = doc(db, "users", userId);
			await setDoc(docRef, data, { merge: true });
			console.log("Saved company data:", data);
			set({ hasEdited: false, originalData: { ...data } });
		} catch (error) {
			console.error("Error saving company data:", error);
		}
	},
}));
