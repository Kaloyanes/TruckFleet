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

	const chatQuery = useMemo(() => {
		if (!user?.uid) return null;
		console.log("Creating query for user:", user.uid);

		return query(
			collection(db, "chats"),
			where("participants", "array-contains", user.uid),
			orderBy("lastMessageAt", "desc"),
		).withConverter(chatConverter);
	}, [user?.uid]);

	const [snapshot, loading, error] = useCollection(chatQuery, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	if (!user?.uid || loadingAuth) return <Spinner />;
	if (errorAuth || error) {
		console.error("Error:", errorAuth || error);
		return <div>Error loading chats</div>;
	}

	const chats =
		snapshot?.docs.map((doc) => ({
			...doc.data(),
		})) ?? [];

	if (chats.length === 0) {
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
						currentUserId={user.uid} // Use user.uid directly from auth state
					/>
				</motion.div>
			))}
		</div>
	);
}
