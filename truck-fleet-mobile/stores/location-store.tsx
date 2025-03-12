import { create } from "zustand";
import { persist } from "zustand/middleware";
import firestore, {
	type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { mmkvStorage } from "~/models/MMKVStorage";

export const useLocationStore = create(
	persist((set, get) => ({}), {
		name: "location-messages", // unique name
		getStorage: () => mmkvStorage, // Add this here!
	}),
);
