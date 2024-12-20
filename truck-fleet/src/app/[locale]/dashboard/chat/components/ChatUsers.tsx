"use client";
import { Spinner } from "@/components/ui/loading-spinner";
import { auth, db } from "@/lib/Firebase";
import { collection, orderBy, query, where } from "firebase/firestore";
import { motion } from "motion/react";
import { useMemo } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollection,
	useCollectionData,
} from "react-firebase-hooks/firestore";
import ChatItem from "./ChatItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatConverter } from "@/lib/converters/ChatConverter";

export default function ChatUsers() {
	const [user, loadingAuth, errorAuth] = useAuthState(auth);

	const chatQuery = useMemo(() => {
		if (!user?.uid) return null;
		console.log("Creating query for user:", user.uid);

		return query(
			collection(db, "chats"),
			where("participants", "array-contains", user.uid),
			orderBy("lastMessageAt", "desc"),
		).withConverter(ChatConverter);
	}, [user?.uid]);

	const [snapshot, chatLoading, error] = useCollection(chatQuery, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	if (!user?.uid || loadingAuth || chatLoading) return <Spinner />;
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
		<ScrollArea className="h-[calc(100vh-130px)] w-full pl-3">
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
					<ChatItem
						chatId={chat.id}
						chat={chat}
						currentUserId={user.uid} // Use user.uid directly from auth state
					/>
				</motion.div>
			))}
		</ScrollArea>
	);
}
