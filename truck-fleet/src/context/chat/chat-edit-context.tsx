"use client";
import type { DocumentReference } from "firebase/firestore";
import React, { createContext, useState } from "react";

type ChatEditContextType = {
	messageValue: string;
	setMessageValue: React.Dispatch<React.SetStateAction<string>>;
	isEditing: boolean;
	setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
	docRef: DocumentReference | null;
	setDocRef: React.Dispatch<React.SetStateAction<DocumentReference | null>>;
};

export const ChatEditViewContext = createContext<ChatEditContextType | null>(
	null,
);

export default function ChatEditContextProvider({
	children,
}: { children: React.ReactNode }) {
	const [messageValue, setMessageValue] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [docRef, setDocRef] = useState<DocumentReference | null>(null);

	return (
		<ChatEditViewContext.Provider
			value={{
				messageValue,
				setMessageValue,
				isEditing,
				setIsEditing,
				docRef,
				setDocRef,
			}}
		>
			{children}
		</ChatEditViewContext.Provider>
	);
}

export function useChatEditContext() {
	const context = React.useContext(ChatEditViewContext);
	if (!context) {
		throw new Error(
			"useChatEditContext must be used within a ChatEditContextProvider",
		);
	}
	return context;
}
