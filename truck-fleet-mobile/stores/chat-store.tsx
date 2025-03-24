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
	originalChatHistory: Chat[];
	isLoading: boolean;
	error: string | null;
	people: Profile[];
	unsubscribe: (() => void) | null;
	searchTerm: string; // Add this new property

	// Actions
	searchChat: (search: string) => void;
	setChatHistory: (history: Chat[]) => void;
	addChatToHistory: (chat: Chat) => void;
	loadChatHistory: () => void;
	cleanupChatHistory: () => void;
	updateUnreadCount: (chatId: string, count: number) => void;
	loadPeople: (companyId: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
	chatHistory: [],
	originalChatHistory: [],
	isLoading: false,
	error: null,
	people: [],
	unsubscribe: null,
	searchTerm: "", // Initialize with empty string

	searchChat: (search) => {
		set({ searchTerm: search });
		console.log(search);

		if (search.length === 0) {
			console.log("clear");
			set({ chatHistory: get().originalChatHistory });
			return;
		}

		const searchedChat = get().originalChatHistory.filter((chat) => {
			const otherUser = chat.participants.find(
				(user) => user !== firebase.auth().currentUser?.uid,
			);
			const user = get().people.find((person) => person.id === otherUser);
			return user?.name?.toLowerCase().includes(search.toLowerCase());
		});

		set({ chatHistory: searchedChat });
	},
	setChatHistory: (history) =>
		set({ chatHistory: history, originalChatHistory: history }),
	addChatToHistory: (chat) =>
		set((state) => ({
			chatHistory: [chat, ...state.chatHistory],
			originalChatHistory: [chat, ...state.chatHistory],
		})),
	updateUnreadCount: (chatId, count) =>
		set((state) => ({
			chatHistory: state.chatHistory.map((chat) =>
				chat.id === chatId ? { ...chat, unreadCount: count } : chat,
			),
		})),
	loadChatHistory: () => {
		set({ isLoading: true, error: null });
		try {
			const currentUser = firebase.auth().currentUser;
			console.log("Current user:", currentUser?.uid);
			if (!currentUser) {
				set({ error: "User not authenticated", isLoading: false });
				return;
			}

			// Clean up previous subscription if exists
			const unsubscribe = get().unsubscribe;
			if (unsubscribe) {
				console.log("Unsubscribing from previous listener");
				unsubscribe();
			}

			console.log("Setting up new real-time listener for chats");

			const unsub = getFirestore()
				.collection("chats")
				.where("participants", "array-contains", currentUser.uid)
				.orderBy("lastMessageAt", "desc")
				.onSnapshot({
					next: (snapshot) => {
						try {
							console.log(`Processing snapshot with ${snapshot.size} docs`);

							if (snapshot.metadata.hasPendingWrites) {
								console.log(
									"Has local pending writes, waiting for server update",
								);
							}

							const chatHistory = snapshot.docs.map<Chat>((doc) => {
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

							// Sort by lastMessageAt to ensure most recent chats appear first
							chatHistory.sort(
								(a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime(),
							);

							console.log(`Successfully processed ${chatHistory.length} chats`);
							set({
								chatHistory,
								originalChatHistory: chatHistory,
								isLoading: false,
							});
						} catch (err) {
							console.error("Error processing snapshot:", err);
							set({
								error: `Error processing snapshot: ${err.message}`,
								isLoading: false,
							});
						}
					},
					error: (error) => {
						console.error("Chat history subscription error:", error);
						set({
							error: `Snapshot error: ${error.message}`,
							isLoading: false,
						});
					},
				});

			// Store the unsubscribe function
			set({ unsubscribe: unsub });
			console.log("Real-time listener setup complete");
		} catch (error) {
			console.error("Chat history load error:", error);
			set({
				error: `Load error: ${(error as Error).message}`,
				isLoading: false,
				chatHistory: [],
			});
		}
	},
	cleanupChatHistory: () => {
		const { unsubscribe } = get();
		if (unsubscribe) {
			unsubscribe();
			set({ unsubscribe: null });
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
