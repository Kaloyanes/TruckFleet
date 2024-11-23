import type { Driver } from "@/types/driver";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DriverOptionsState {
	selectedDriver: Driver | null;
	confirm: boolean;
	view: "list" | "grid";
	search: string;

	setSelectedDriver: (driver: Driver) => void;
	setConfirm: (confirm: boolean) => void;
	setView: (view: "list" | "grid") => void;
	setSearch: (search: string) => void;
}

const defaultValues: Pick<
	DriverOptionsState,
	"selectedDriver" | "confirm" | "view" | "search"
> = {
	selectedDriver: null,
	confirm: false,
	view: "list",
	search: "",
};

export const useDriverOptionsStore = create<DriverOptionsState>()(
	persist(
		(set) => ({
			...defaultValues,
			setSearch: (search) => set({ search }),
			setSelectedDriver: (driver) => set({ selectedDriver: driver }),
			setConfirm: (confirm) => set({ confirm }),
			setView: (view) => set({ view }),
		}),
		{
			name: "driver-options",
			partialize: (state) => ({
				view: state.view,
			}),
		},
	),
);
