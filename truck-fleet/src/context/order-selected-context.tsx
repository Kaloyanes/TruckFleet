"use client";
import React from "react";
import { createContext, useState } from "react";

type OrderSelectedContextType = {
	id: string;
	setId: React.Dispatch<React.SetStateAction<string>>;
};

export const OrderSelectedContext =
	createContext<OrderSelectedContextType | null>(null);

export default function OrderSelectedContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [id, setId] = useState("");

	return (
		<OrderSelectedContext.Provider value={{ id, setId }}>
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
