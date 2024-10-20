"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { messageConverter } from "@/firebase/converters/messageConverter";
import { auth, db } from "@/firebase/firebase";
import { redirect } from "@/lib/navigation";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollectionData,
	useDocumentData,
} from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";

export default function ChatWindow() {
	const chatId = useParams().chatId as string;
	const [user, userLoading, userError] = useAuthState(auth);

	const [chatData, chatLoading, chatError] = useDocumentData(
		doc(db, "chats", chatId),
	);

	const [messages, messagesLoading, messagesError] = useCollectionData(
		query(
			collection(db, "chats", chatId, "messages"),
			orderBy("createdAt"),
		).withConverter(messageConverter),
	);

	if (userLoading || chatLoading || messagesLoading) return <></>;

	if (chatError) return <div>Error: {chatError.message}</div>;

	if (messagesError) return <div>Error: {messagesError.message}</div>;

	if (!chatData?.participants.includes(user?.uid)) {
		redirect("/dashboard/chat");
		return;
	}

	if (!messages) {
		return <div>Get the conversation going</div>;
	}

	if (user === undefined || user === null) {
		return <div>Not logged in</div>;
	}

	return (
		<ScrollArea className="flex h-screen flex-col gap-4 px-4 ">
			<div className="h-10" />

			<div className="space-y-4">
				{messages.map((message, index: number) => {
					console.log(message);
					return (
						<ChatMessage message={message} userId={user.uid} key={message.id} />
					);
				})}
			</div>
			<div className="h-20" />
			<ScrollBar />
		</ScrollArea>
	);
}
