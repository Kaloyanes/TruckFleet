"use client";
import type { Order } from "@/models/orders";
import React from "react";
import { createContext, useState } from "react";

type OrderSelectedContextType = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	order: Order | null;
	setOrder: React.Dispatch<React.SetStateAction<Order | null>>;
};

export const EditOrderContext = createContext<OrderSelectedContextType | null>(
	null,
);

export default function EditOrderContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [order, setOrder] = useState<Order | null>(null);
	const [open, setOpen] = useState<boolean>(false);

	return (
		<EditOrderContext.Provider value={{ order, setOrder, open, setOpen }}>
			{children}
		</EditOrderContext.Provider>
	);
}

export function useEditOrderContext() {
	const context = React.useContext(EditOrderContext);
	if (!context) {
		throw new Error("useOrderSelected must be used within a EditOrderContext");
	}
	return context;
}
