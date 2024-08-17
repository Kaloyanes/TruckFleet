"use client";
import type { Order } from "@/models/orders";
import React from "react";
import { createContext, useState } from "react";

type DeleteOrderContextType = {
	confirm: boolean;
	setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
	order: Order | null;
	setOrder: React.Dispatch<React.SetStateAction<Order | null>>;
};

export const DeleteOrderContext = createContext<DeleteOrderContextType | null>(
	null,
);

export default function DeleteOrderContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [order, setOrder] = useState<Order | null>(null);
	const [confirm, setConfirm] = useState<boolean>(false);

	return (
		<DeleteOrderContext.Provider
			value={{ order, setOrder, confirm, setConfirm }}
		>
			{children}
		</DeleteOrderContext.Provider>
	);
}

export function useDeleteOrderContext() {
	const context = React.useContext(DeleteOrderContext);
	if (!context) {
		throw new Error("useOrderSelected must be used within a EditOrderContext");
	}
	return context;
}
