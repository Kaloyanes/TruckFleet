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
	loadTrucks: (companyId: string) => () => void; // returns unsubscribe function
	editTruck: (truckId: string, data: Partial<Truck>) => Promise<void>;
	deleteTruck: (truckId: string) => Promise<void>;
	createTruck: (
		companyId: string,
		data: Omit<Truck, "id" | "createdAt">,
	) => Promise<void>;
}

export const useTruckStore = create<TruckStore>()(
	devtools((set) => ({
		trucks: [],
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
		editTruck: async (truckId: string, data: Partial<Truck>) => {
			const truckDocRef = doc(db, "trucks", truckId);
			await updateDoc(truckDocRef, data);
		},
		deleteTruck: async (truckId: string) => {
			const truckDocRef = doc(db, "trucks", truckId);
			await deleteDoc(truckDocRef);
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
