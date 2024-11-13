import type { Order } from "@/models/orders";
import { create } from "zustand";

interface OrderOptionsStore {
	showDeleteDialog: boolean;
	order: Order | null;
	showEditSheet: boolean;

	openEditSheet: (show: boolean) => void;
	openDeleteDialog: (confirm: boolean) => void;
	setOrder: (order: Order | null) => void;
}

const defaultValues = {
	order: null,
	showEditSheet: false,
	showDeleteDialog: false,
};

export const useOrderOptionsStore = create<OrderOptionsStore>((set) => ({
	...defaultValues,
	openEditSheet: (show) => set({ showEditSheet: show }),
	openDeleteDialog: (confirm) => set({ showDeleteDialog: confirm }),
	setOrder: (order) => set({ order }),
}));
