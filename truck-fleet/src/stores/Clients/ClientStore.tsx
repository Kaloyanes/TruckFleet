import { create } from "zustand";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import type { Client } from "@/types/client";

interface ClientStoreState {
	clients: Client[];
	loading: boolean;
	error: string | null;
	fetchClients: (companyId: string) => Promise<void>;
}

export const useClientStore = create<ClientStoreState>((set) => ({
	clients: [],
	loading: false,
	error: null,
	fetchClients: async (companyId: string) => {
		set({ loading: true, error: null });
		try {
			const db = getFirestore();
			const clientsRef = collection(db, `companies/${companyId}/clients`);
			const snapshot = await getDocs(clientsRef);
			const clients = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Client[];
			set({ clients, loading: false });
		} catch (error: any) {
			set({ error: error.message || "Failed to load clients", loading: false });
		}
	},
}));
