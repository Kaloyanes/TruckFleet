"use client";

import { createContext, useContext, useState } from "react";
import { deleteDoc, type DocumentReference } from "firebase/firestore";

interface DeleteMessageContextType {
	showDeleteDialog: boolean;
	messageToDelete: DocumentReference | null;
	openDeleteDialog: (docRef: DocumentReference, e?: React.MouseEvent) => void;
	closeDeleteDialog: () => void;
}

const DeleteMessageContext = createContext<DeleteMessageContextType>({
	showDeleteDialog: false,
	messageToDelete: null,
	openDeleteDialog: () => {},
	closeDeleteDialog: () => {},
});

export function DeleteMessageProvider({
	children,
}: { children: React.ReactNode }) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [messageToDelete, setMessageToDelete] =
		useState<DocumentReference | null>(null);

	const openDeleteDialog = (
		docRef: DocumentReference,
		e?: React.MouseEvent,
	) => {
		if (e?.shiftKey) {
			deleteDoc(docRef);
			return;
		}
		setMessageToDelete(docRef);
		setShowDeleteDialog(true);
	};

	const closeDeleteDialog = () => {
		setShowDeleteDialog(false);
		setMessageToDelete(null);
	};

	return (
		<DeleteMessageContext.Provider
			value={{
				showDeleteDialog,
				messageToDelete,
				openDeleteDialog,
				closeDeleteDialog,
			}}
		>
			{children}
		</DeleteMessageContext.Provider>
	);
}

export const useDeleteMessage = () => useContext(DeleteMessageContext);
