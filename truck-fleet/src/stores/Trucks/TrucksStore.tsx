import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
	getFirestore,
	collection,
	query,
	where,
	onSnapshot,
	doc,
	updateDoc,
	deleteDoc,
	addDoc,
	serverTimestamp,
} from "firebase/firestore";
import type { Truck } from "@/types/truck";
import { TruckConverter } from "@/lib/converters/TruckConverter";
import { db } from "@/lib/Firebase";

interface TruckStore {
	trucks: Truck[];
	selectedTruck: null | Truck;
	isDeletingTruck: boolean;
	isEditingTruck: boolean;
	loadTrucks: (companyId: string) => () => void; // returns unsubscribe function
	editTruck: (confirmed: boolean, data: Partial<Truck>) => Promise<void>;
	deleteTruck: (confirmed: boolean) => Promise<void>;
	createTruck: (
		companyId: string,
		data: Omit<Truck, "id" | "createdAt">,
	) => Promise<void>;
	deleteTruckDialog: (truckId: string) => void;
	editTruckDialog: (truckId: string) => void;
}

export const useTruckStore = create<TruckStore>()(
	devtools((set, get) => ({
		trucks: [],
		isDeletingTruck: false,
		isEditingTruck: false,
		selectedTruck: null,
		loadTrucks: (companyId: string) => {
			const trucksRef = collection(db, "trucks");
			const trucksQuery = query(
				trucksRef,
				where("companyId", "==", companyId),
			).withConverter(TruckConverter);

			const unsubscribe = onSnapshot(trucksQuery, (querySnapshot) => {
				const trucks = querySnapshot.docs.map((doc) => ({
					...doc.data(),
				})) as Truck[];
				set({ trucks });
			});
			return unsubscribe;
		},
		editTruckDialog: async (truckId: string) => {
			const selectedTruck = get().trucks.find((truck) => truck.id === truckId);

			set({ isEditingTruck: true, selectedTruck });
		},
		editTruck: async (confirmed: boolean, data: Partial<Truck>) => {
			const selectedTruck = get().selectedTruck;
			if (selectedTruck === null || !confirmed) {
				set({ isEditingTruck: false, selectedTruck: null });
				return;
			}

			const truckDocRef = doc(db, "trucks", selectedTruck.id);
			await updateDoc(truckDocRef, data);
		},
		deleteTruckDialog: async (truckId: string) => {
			const selectedTruck = get().trucks.find((truck) => truck.id === truckId);

			set({ isDeletingTruck: true, selectedTruck });
		},
		deleteTruck: async (confirmed: boolean) => {
			const selectedTruck = get().selectedTruck;

			if (selectedTruck === null || !confirmed) {
				set({ isDeletingTruck: false, selectedTruck: null });
				return;
			}

			const truckDocRef = doc(db, "trucks", selectedTruck.id);
			await deleteDoc(truckDocRef);
			set({ isDeletingTruck: false, selectedTruck: null });
		},

		createTruck: async (
			companyId: string,
			data: Omit<Truck, "id" | "createdAt">,
		) => {
			const trucksRef = collection(db, "trucks");
			await addDoc(trucksRef, {
				...data,
				companyId,
				createdAt: serverTimestamp(),
			});
		},
	})),
);
