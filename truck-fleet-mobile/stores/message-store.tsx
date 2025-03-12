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
};

interface MessageStore {
	messages: Message[];
	loading: boolean;
	error: string | null;
	loadMessages: (id: string) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set) => ({
	messages: [],
	loading: false,
	error: null,
	loadMessages: async (id: string) => {
		set({ loading: true, error: null });
		try {
			const snapshot = await firestore()
				.collection(`chats/${id}/messages`)
				.orderBy("createdAt", "desc")
				.get();
			const messages: Message[] = snapshot.docs.map((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					content: data.content,
					sender: data.sender,
					type: data.type,
					createdAt: data.createdAt,
				};
			});
			set({ messages, loading: false });
		} catch (error: any) {
			set({ error: error.message, loading: false });
		}
	},
}));
