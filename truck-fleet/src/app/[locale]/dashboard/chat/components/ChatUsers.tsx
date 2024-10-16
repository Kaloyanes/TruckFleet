"use client";
import { auth, db } from "@/firebase/firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import ChatItem from "./ChatItem";

export default function ChatUsers() {
	const [user, loadingAuth, errorAuth] = useAuthState(auth);

	const chatQuery = useMemo(() => {
		if (user) {
			return query(
				collection(db, "chats"),
				where("participants", "array-contains", user.uid),
				orderBy("lastMessageAt", "desc"),
			);
		}
		return null;
	}, [user]);

	const [chats, loading, error] = useCollection(chatQuery);

	if (loadingAuth || loading) return <div>Loading...</div>;
	if (errorAuth) return <div>Error: {errorAuth.message}</div>;
	if (error) return <div>Error: {error.message}</div>;

	if (!chats || chats.empty) {
		return <div>No chats available</div>;
	}

	return (
		<div>
			{chats.docs.map((chat, index) => (
				<motion.div
					key={chat.id}
					initial={{ opacity: 0, x: -250 }}
					animate={{
						opacity: 1,
						x: 0,
						transition: {
							type: "spring",
							duration: 0.7,
							delay: (index + 1) * 0.1,
						},
					}}
				>
					<ChatItem
						chatId={chat.id}
						chat={chat.data()}
						currentUserId={auth.currentUser?.uid}
					/>
				</motion.div>
			))}
		</div>
	);
}
