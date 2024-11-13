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

  // Invoice details
  iban: string;
  bank: string;
  bankCode: string;
  vatNumber: string;

  // State
  isLoading: boolean;

  // Actions
  setField: (field: string, value: string) => void;
  reset: () => void;
  load: (userId: string) => Promise<void>;
  save: (userId: string) => Promise<void>;
}

const initialState = {
  name: "",
  personInCharge: "",
  ownerEmail: "",
  phone: "",
  address: "",
  iban: "",
  bank: "",
  bankCode: "",
  vatNumber: "",
  isLoading: true,
  hasEdited: false,
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
  ...initialState,

  setField: (field: string, value: string) => {
    set((state) => ({ ...state, [field]: value, hasEdited: true }));
  },

  reset: () => set(initialState),

  load: async (userId: string) => {
    set({ isLoading: true });
    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      console.log("Loading company data for:", userId); // Debug log

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Found company data:", data); // Debug log
        set({ ...data, isLoading: false });
      } else {
        console.warn("No company document found"); // Debug warning
        set({ ...initialState, isLoading: false });
      }
    } catch (error) {
      console.error("Error loading company data:", error);
      set({ ...initialState, isLoading: false });
    }
  },

  save: async (userId: string) => {
    const state = get();
    const { isLoading, load, save, setField, reset, ...data } = state;

    try {
      const docRef = doc(db, "companies", userId);
      await setDoc(docRef, data, { merge: true });
      console.log("Saved company data:", data); // Debug log
    } catch (error) {
      console.error("Error saving company data:", error);
    }
  },
}));
