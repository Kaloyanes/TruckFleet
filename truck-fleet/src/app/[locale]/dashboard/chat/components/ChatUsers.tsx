"use client";
import { Spinner } from "@/components/ui/loading-spinner";
import { chatConverter } from "@/firebase/converters/chatConverter";
import { auth, db } from "@/firebase/firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollection,
	useCollectionData,
} from "react-firebase-hooks/firestore";
import ChatItem from "./ChatItem";

export default function ChatUsers() {
	const [user, loadingAuth, errorAuth] = useAuthState(auth);

	const chatQuery = query(
		collection(db, "chats"),
		where("participants", "array-contains", user?.uid ?? ""),
		orderBy("lastMessageAt", "desc"),
	).withConverter(chatConverter);

	const [chats, loading, error] = useCollectionData(chatQuery);

	if (loadingAuth || loading)
		return (
			<div className="flex h-full flex-col items-center justify-center">
				<Spinner />
			</div>
		);
	if (errorAuth) return <div>Error: {errorAuth.message}</div>;
	if (error) return <div>Error: {error.message}</div>;

	if (!chats || chats.length === 0) {
		return <div>No chats available</div>;
	}

	return (
		<div>
			{chats.map((chat, index) => (
				<motion.div
					key={chat.id}
					initial={{ opacity: 0, x: -250, filter: "blur(10px)" }}
					animate={{
						opacity: 1,
						x: 0,
						filter: "blur(0px)",
						transition: {
							type: "spring",
							duration: 0.7,
							delay: (index + 1) * 0.1,
						},
					}}
					className=""
				>
					<ChatItem
						chatId={chat.id}
						chat={chat}
						currentUserId={auth.currentUser?.uid}
					/>
				</motion.div>
			))}
		</div>
	);
}
