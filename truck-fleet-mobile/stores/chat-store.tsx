import {
	firebase,
	getFirestore,
	Timestamp,
} from "@react-native-firebase/firestore";
import { create } from "zustand";
import type { Profile } from "~/models/Profile";

export interface Chat {
	id: string;
	createdAt: Date;
	lastMessageAt: Date;
	participants: string[];
}

interface ChatState {
	chatHistory: Chat[];
	isLoading: boolean;
	error: string | null;
	people: Profile[];

	// Actions
	setChatHistory: (history: Chat[]) => void;
	addChatToHistory: (chat: Chat) => void;
	loadChatHistory: () => Promise<void>;
	updateUnreadCount: (chatId: string, count: number) => void;
	loadPeople: (companyId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set) => ({
	chatHistory: [],
	isLoading: false,
	error: null,
	people: [],

	setChatHistory: (history) => set({ chatHistory: history }),
	addChatToHistory: (chat) =>
		set((state) => ({ chatHistory: [chat, ...state.chatHistory] })),
	updateUnreadCount: (chatId, count) =>
		set((state) => ({
			chatHistory: state.chatHistory.map((chat) =>
				chat.id === chatId ? { ...chat, unreadCount: count } : chat,
			),
		})),
	loadChatHistory: async () => {
		set({ isLoading: true, error: null });
		try {
			const currentUser = firebase.auth().currentUser;
			console.log(currentUser?.uid);
			if (!currentUser) {
				throw new Error("User not authenticated");
			}

			const chats = await getFirestore()
				.collection("chats")
				.where("participants", "array-contains", currentUser.uid)
				.get();

			console.log(chats.docs);

			const chatHistory = chats.docs.map<Chat>((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					createdAt: data.createdAt
						? new Date(data.createdAt.toDate())
						: new Date(),
					lastMessageAt: data.lastMessageAt
						? new Date(data.lastMessageAt.toDate())
						: new Date(),
					participants: data.participants || [],
				};
			});

			set({ chatHistory, isLoading: false });
		} catch (error) {
			console.error("Chat history load error:", error);
			set({
				error: (error as Error).message,
				isLoading: false,
				chatHistory: [],
			});
		}
	},
	loadPeople: async (companyId: string) => {
		set({ isLoading: true, error: null });
		try {
			const people = await getFirestore()
				.collection("users")
				.where("companyId", "==", companyId)
				.get();

			const profiles = people.docs.map<Profile>((doc) => {
				const data = doc.data();
				return {
					id: doc.id,
					name: data.name,
					companyId: data.companyId,
					email: data.email,
					phone: data.phone,
					photoUrl: data.photoUrl,
					type: data.type as "driver" | "speditor" | "ceo",
					location: data.location,
				};
			});

			set({ people: profiles, isLoading: false });
		} catch (error) {
			console.error("People load error:", error);
			set({ error: (error as Error).message, isLoading: false });
		}
	},
}));
