import { create } from "zustand";
import firestore, {
	type FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";

export type Message = {
	id: string;
	content: string;
	sender: string;
	type: string;
	createdAt: FirebaseFirestoreTypes.Timestamp;
	updatedAt?: FirebaseFirestoreTypes.Timestamp;
};

interface MessageStore {
	messages: Message[];
	loading: boolean;
	error: string | null;
	loadMessages: (id: string) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
	messages: [],
	loading: false,
	error: null,
	loadMessages: async (id: string) => {
		set({ loading: true, error: null });
		try {
			const snapshot = await firestore()
				.collection(`chats/${id}/messages`)
				.orderBy("createdAt", "asc")
				.limit(10)
				.get();
			const messages: Message[] = snapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					content: data.content,
					sender: data.senjder,
					type: data.type,
					createdAt: data.createdAt,
					updatedAt: data.updatedAt ?? null,
				};
			});
			set({ messages, loading: false });
		} catch (error: any) {
			set({ error: error.message, loading: false });
		}
	},
	loadMoreMessages: async (id: string) => {
		try {
			const state = get();
			if (state.messages.length === 0) return;
			const firstMessage = state.messages[0];
			const snapshot = await firestore()
				.collection(`chats/${id}/messages`)
				.orderBy("createdAt", "asc")
				.endBefore(firstMessage.createdAt)
				.limitToLast(10)
				.get();
			const moreMessages: Message[] = snapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					content: data.content,
					sender: data.sender,
					type: data.type,
					createdAt: data.createdAt,
					updatedAt: data.updatedAt ?? null,
				};
			});
			if (moreMessages.length > 0) {
				set({ messages: [...moreMessages, ...state.messages] });
			}
		} catch (error: any) {
			set({ error: error.message });
		}
	},
}));
