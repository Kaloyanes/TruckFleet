import { create } from "zustand";
import { db } from "@/lib/Firebase";
import {
	deleteDoc,
	doc,
	collection,
	addDoc,
	query,
	where,
	getDocs,
	onSnapshot,
	orderBy,
} from "firebase/firestore";
import { toast } from "@/components/ui/use-toast";
import { MessageConverter } from "@/lib/converters/MessageConverter";
import type { Chat } from "@/types/chat"; // Import Chat type
import { ChatConverter } from "@/lib/converters/ChatConverter"; // Import ChatConverter

interface ChatState {
	chats: Chat[]; // Add chats array
	isLoadingChats: boolean; // Add loading state for chats
	chatsError: string | null; // Add error state for chats
	isDeleting: boolean;
	isCreating: boolean;
	deleteChat: (chatId: string, navigateHome: () => void) => Promise<void>;
	createChat: (
		participants: string[],
		navigateToChat: (chatId: string) => void,
	) => Promise<void>;
	loadChats: (userId: string) => () => void; // Add loadChats function signature (returns unsubscribe function)
}

export const useChatStore = create<ChatState>((set) => ({
	chats: [], // Initialize chats array
	isLoadingChats: false, // Initialize loading state
	chatsError: null, // Initialize error state
	isDeleting: false,
	isCreating: false,

	loadChats: (userId) => {
		// Check if userId is valid before proceeding
		if (!userId) {
			console.error("loadChats called with undefined userId");
			set({
				chats: [],
				isLoadingChats: false,
				chatsError: "User ID is missing.",
			});
			return () => {}; // Return an empty unsubscribe function
		}

		set({ isLoadingChats: true, chatsError: null });

		const chatsRef = collection(db, "chats").withConverter(ChatConverter);
		const q = query(
			chatsRef,
			where("participants", "array-contains", userId), // userId is now guaranteed to be defined
			orderBy("lastMessageAt", "desc"), // Order by most recent activity
		);

		const unsubscribe = onSnapshot(
			q,
			(snapshot) => {
				const loadedChats = snapshot.docs.map((doc) => doc.data());
				set({ chats: loadedChats, isLoadingChats: false });
			},
			(error) => {
				console.error("Error loading chats:", error);
				set({
					chatsError: "Failed to load chats. Please try again later.",
					isLoadingChats: false,
				});
				toast({
					title: "Failed to load chats.",
					description: error.message,
					variant: "destructive",
				});
			},
		);

		// Return the unsubscribe function to clean up the listener
		return unsubscribe;
	},

	deleteChat: async (chatId, navigateHome) => {
		set({ isDeleting: true });
		try {
			// Note: Deleting subcollections like 'messages' requires a more complex approach,
			// often using Cloud Functions for efficiency and completeness.
			// This implementation only deletes the main chat document.
			const chatDocRef = doc(db, "chats", chatId);
			await deleteDoc(chatDocRef);
			toast({
				title: "Chat deleted successfully.",
				variant: "success",
			});
			navigateHome(); // Navigate away after deletion
		} catch (error: any) {
			console.error("Error deleting chat:", error);
			toast({
				title: "Failed to delete chat.",
				description: error.message,
				variant: "destructive",
			});
		} finally {
			set({ isDeleting: false });
		}
	},

	createChat: async (participants, navigateToChat) => {
		// Check if participants array is valid and contains defined UIDs
		if (
			!participants ||
			participants.length < 2 ||
			participants.some((p) => p === undefined)
		) {
			console.error(
				"createChat called with invalid participants:",
				participants,
			);
			toast({
				title: "Failed to create chat.",
				description: "Invalid participant information.",
				variant: "destructive",
			});
			set({ isCreating: false }); // Ensure loading state is reset
			return;
		}

		set({ isCreating: true });
		try {
			// Check if a chat with these participants already exists
			const chatsRef = collection(db, "chats");

			const sortedParticipants = [...participants].sort(); // Sort a copy to avoid mutating original

			// Simple check (might create duplicates if order differs or more than 2 participants):
			const q = query(
				chatsRef,
				where("participants", "==", sortedParticipants), // Use the validated and sorted participants
			);
			const existingChats = await getDocs(q);

			if (!existingChats.empty) {
				// Chat already exists, navigate to it
				const existingChatId = existingChats.docs[0].id;
				navigateToChat(existingChatId);
				set({ isCreating: false });
				return;
			}

			// Create new chat
			const newChatRef = await addDoc(chatsRef, {
				participants: sortedParticipants, // Store sorted participants
				createdAt: new Date(),
				lastMessageAt: new Date(), // Initialize last message timestamp
			});
			toast({
				title: "Chat created successfully.",
				variant: "success",
			});
			navigateToChat(newChatRef.id); // Navigate to the new chat
		} catch (error: any) {
			console.error("Error creating chat:", error);
			toast({
				title: "Failed to create chat.",
				description: error.message,
				variant: "destructive",
			});
		} finally {
			set({ isCreating: false });
		}
	},
}));
