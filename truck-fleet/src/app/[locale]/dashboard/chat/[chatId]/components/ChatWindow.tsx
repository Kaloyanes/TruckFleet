"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { messageConverter } from "@/firebase/converters/messageConverter";
import { auth, db } from "@/firebase/firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react"; // Use useEffect instead of useLayoutEffect
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import ChatMessage from "./ChatMessage";

export default function ChatWindow() {
	const bottomRef = useRef<HTMLDivElement>(null);
	const chatId = useParams().chatId as string;
	const [user, userLoading] = useAuthState(auth);

	const [messages, messagesLoading, messagesError] = useCollectionData(
		query(
			collection(db, "chats", chatId, "messages"),
			orderBy("createdAt"),
		).withConverter(messageConverter),
	);

	useEffect(() => {
		if (messages && messages.length > 1)
			setTimeout(() => {
				bottomRef.current?.scrollIntoView({ behavior: "instant" });
			}, 73);
	}, [messages]);

	if (userLoading || messagesLoading) return <></>;
	if (messagesError) return <div>Error: {messagesError.message}</div>;
	if (!messages) return <div>Get the conversation going</div>;

	return (
		<ScrollArea className="flex max-h-screen flex-1 flex-col gap-4 overflow-y-auto px-4">
			<div className="h-full space-y-4 pt-4 pb-14">
				{messages.map((message: any, index: number) => {
					return (
						<div
							key={message.id}
							ref={index === messages.length - 1 ? bottomRef : undefined}
						>
							<ChatMessage
								message={message}
								userId={user?.uid ?? ""}
								key={message.id + index.toString()}
							/>
						</div>
					);
				})}
			</div>
		</ScrollArea>
	);
}
