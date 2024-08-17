"use client";
import type { Order } from "@/models/orders";
import React from "react";
import { createContext, useState } from "react";

type OrderSelectedContextType = {
	order: Order | null;
	setOrder: React.Dispatch<React.SetStateAction<Order | null>>;
};

export const OrderSelectedContext =
	createContext<OrderSelectedContextType | null>(null);

export default function OrderSelectedContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [order, setOrder] = useState<Order | null>(null);

	return (
		<OrderSelectedContext.Provider value={{ order, setOrder }}>
			{children}
		</OrderSelectedContext.Provider>
	);
}

export function useOrderIdContext() {
	const context = React.useContext(OrderSelectedContext);
	if (!context) {
		throw new Error(
			"useOrderSelected must be used within a OrderSelectedContextProvider",
		);
	}
	return context;
}
