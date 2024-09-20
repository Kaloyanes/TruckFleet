"use client";
import type { Order } from "@/models/orders";
import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { useLocalStorage } from "react-use";

type DriverFilterInputContextType = {
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const DriverFilterInputViewContext =
	createContext<DriverFilterInputContextType | null>(null);

export default function DriverFilterInputContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [search, setSearch] = useState("");

	return (
		<DriverFilterInputViewContext.Provider value={{ search, setSearch }}>
			{children}
		</DriverFilterInputViewContext.Provider>
	);
}

export function useDriverFilterInputContext() {
	const context = React.useContext(DriverFilterInputViewContext);
	if (!context) {
		throw new Error(
			"useDriverFilterInputContext must be used within a DriverFilterInputContextProvider",
		);
	}
	return context;
}
