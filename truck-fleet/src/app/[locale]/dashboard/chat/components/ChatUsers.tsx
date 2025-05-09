"use client";
import { Spinner } from "@/components/ui/loading-spinner";
import { auth } from "@/lib/Firebase"; // Removed db import
import { motion } from "motion/react";
import { useEffect } from "react"; // Added useEffect
import { useAuthState } from "react-firebase-hooks/auth";
import ChatItem from "./ChatItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/stores/Chats/ChatStore"; // Import the store

export default function ChatUsers() {
	const [user, loadingAuth, errorAuth] = useAuthState(auth);
	const { chats, isLoadingChats, chatsError, loadChats } = useChatStore(); // Use the store

	// Load chats when user is available
	useEffect(() => {
		if (user?.uid) {
			console.log("Loading chats for user:", user.uid);
			const unsubscribe = loadChats(user.uid);
			// Cleanup listener on component unmount or user change
			return () => {
				console.log("Unsubscribing from chat updates for user:", user?.uid); // Use optional chaining for safety on unmount
				unsubscribe();
			};
		}
	}, [user?.uid, loadChats]); // Depend on user ID and loadChats action

	// Combine loading states
	const isLoading = loadingAuth || isLoadingChats;
	// Combine error states
	const error = errorAuth || chatsError;

	if (isLoading) return <Spinner />;
	if (error) {
		console.error("Error:", error);
		// Display specific error from store if available
		return (
			<div>{typeof error === "string" ? error : "Error loading chats"}</div>
		);
	}
	if (!user?.uid) {
		// Should ideally not happen if loadingAuth is false, but good practice
		return <div>Please log in.</div>;
	}

	// Check isLoading again to avoid flash of "No chats"
	if (chats.length === 0 && !isLoading) {
		return <div>No chats available</div>;
	}

	return (
		<ScrollArea className="h-[calc(100vh-130px)] w-full pl-3">
			{/* Use chats array from the store */}
			{chats.map((chat, index) => (
				<motion.div
					key={chat.id}
					initial={{
						opacity: 0,
						x: 250,
						filter: "blur(10px)",
					}}
					animate={{
						opacity: 1,
						x: 0,
						filter: "blur(0px)",
						transition: {
							type: "spring",
							duration: 0.7,
							bounce: 0.1,
							delay: (index + 1) * 0.1,
						},
					}}
					className="overflow-hidden"
				>
					<ChatItem chatId={chat.id} chat={chat} currentUserId={user.uid} />
				</motion.div>
			))}
		</ScrollArea>
	);
}
