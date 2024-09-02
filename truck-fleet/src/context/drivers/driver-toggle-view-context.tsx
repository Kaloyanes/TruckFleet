"use client";
import type { Order } from "@/models/orders";
import React, { useEffect } from "react";
import { createContext, useState } from "react";
import { useLocalStorage } from "react-use";

type DriverToggleViewContextType = {
	view: string | null;
	setView: React.Dispatch<React.SetStateAction<string | null>>;
};

export const DriverToggleViewContext =
	createContext<DriverToggleViewContextType | null>(null);

export default function DriverToggleViewContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [view, setView] = useState<string | null>("list");
	const [value, setValue] = useLocalStorage("driver-view", "list");

	useEffect(() => {
		setView(value ?? "list");
	}, [value]);

	return (
		<DriverToggleViewContext.Provider value={{ view, setView }}>
			{children}
		</DriverToggleViewContext.Provider>
	);
}

export function useDriverToggleViewContext() {
	const context = React.useContext(DriverToggleViewContext);
	if (!context) {
		throw new Error(
			"useDriverToggleViewContext must be used within a DriverToggleViewContextProvider",
		);
	}
	return context;
}
