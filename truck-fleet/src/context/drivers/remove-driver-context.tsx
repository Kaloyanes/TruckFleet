"use client";
import type { Driver } from "@/models/driver";
import React from "react";
import { createContext, useState } from "react";

type RemoveDriverContextType = {
	confirm: boolean;
	setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
	driver: Driver | null;
	setDriver: React.Dispatch<React.SetStateAction<Driver | null>>;
};

export const RemoveDriverContext =
	createContext<RemoveDriverContextType | null>(null);

export default function RemoveDriverContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [driver, setDriver] = useState<Driver | null>(null);
	const [confirm, setConfirm] = useState<boolean>(false);

	return (
		<RemoveDriverContext.Provider
			value={{ driver, setDriver, confirm, setConfirm }}
		>
			{children}
		</RemoveDriverContext.Provider>
	);
}

export function useRemoveDriverContext() {
	const context = React.useContext(RemoveDriverContext);
	if (!context) {
		throw new Error(
			"useRemoveDriverContext must be used within a RemoveDriverContext",
		);
	}
	return context;
}
