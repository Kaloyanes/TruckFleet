import { type DocumentReference, deleteDoc } from "firebase/firestore";
import { create } from "zustand";

interface ChatOptionsState {
	messageValue: string;
	isEditing: boolean;
	docRef: DocumentReference | null;
	showDeleteDialog: boolean;
	messageToDelete: DocumentReference | null;

	setMessageValue: (value: string) => void;
	setIsEditing: (value: boolean) => void;
	setDocRef: (ref: DocumentReference | null) => void;
	openDeleteDialog: (docRef: DocumentReference, e?: React.MouseEvent) => void;
	closeDeleteDialog: () => void;
}

const defaultValues: Pick<
	ChatOptionsState,
	| "messageValue"
	| "isEditing"
	| "docRef"
	| "showDeleteDialog"
	| "messageToDelete"
> = {
	messageValue: "",
	isEditing: false,
	docRef: null,
	showDeleteDialog: false,
	messageToDelete: null,
};

export const useChatOptionsStore = create<ChatOptionsState>((set) => ({
	...defaultValues,
	setMessageValue: (value) => set({ messageValue: value }),
	setIsEditing: (value) => set({ isEditing: value }),
	setDocRef: (ref) => set({ docRef: ref }),
	openDeleteDialog: async (docRef, e) => {
		if (e?.shiftKey) {
			await deleteDoc(docRef);
			return;
		}
		set({ messageToDelete: docRef, showDeleteDialog: true });
	},
	closeDeleteDialog: () =>
		set({ showDeleteDialog: false, messageToDelete: null }),
}));
