"use client";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

interface DriverToggleViewContextType {
	view: string;
	setView: (view: string) => void;
}

const DriverToggleViewContext = createContext<DriverToggleViewContextType>({
	view: "list",
	setView: () => {},
});

export function DriverToggleViewProvider({
	children,
}: { children: React.ReactNode }) {
	const [view, setView] = useState<string>("list");

	useEffect(() => {
		// Get the stored value on mount
		const storedView = localStorage.getItem("driver-view");
		if (storedView) {
			setView(storedView);
		}
	}, []);

	return (
		<DriverToggleViewContext.Provider value={{ view, setView }}>
			{children}
		</DriverToggleViewContext.Provider>
	);
}

export const useDriverToggleViewContext = () =>
	useContext(DriverToggleViewContext);
