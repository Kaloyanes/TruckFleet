"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/loading-spinner";
import { messageConverter } from "@/firebase/converters/messageConverter";
import { auth, db } from "@/firebase/firebase";
import { collection, doc, orderBy, query } from "firebase/firestore";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollectionData,
	useDocumentData,
} from "react-firebase-hooks/firestore";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import type { Message } from "@/models/message";
import useProfileDoc from "@/hooks/useProfileDoc";
import type { Chat } from "@/models/chat";
import { chatConverter } from "@/firebase/converters/chatConverter";

export default function ChatWindow() {
	const bottomRef = useRef<HTMLDivElement>(null);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const chatId = useParams().chatId as string;
	const [user, userLoading] = useAuthState(auth);

	// Get chat document with participant info
	const [chatDoc, chatLoading, chatError] = useDocumentData(
		doc(db, "chats", chatId).withConverter(chatConverter),
	);

	// Get the other participant's profile
	const participantId = chatDoc?.participants.find(
		(p: string) => p !== user?.uid,
	);
	const { profile: participantProfile, loading: profileLoading } =
		useProfileDoc(participantId);

	const [messages, messagesLoading, messagesError] = useCollectionData(
		query(
			collection(db, "chats", chatId, "messages"),
			orderBy("createdAt"),
		).withConverter(messageConverter),
	);

	function scrollToBottom() {
		if (bottomRef.current) {
			bottomRef.current.scrollIntoView({ behavior: "auto" });
		}
	}

	if (userLoading || messagesLoading || chatLoading || profileLoading) {
		return <Spinner />;
	}

	if (messagesError) return <div>Error: {messagesError.message}</div>;
	if (chatError) return <div>Error: {chatError.message}</div>;
	if (!messages) return <div>Get the conversation going</div>;
	if (!participantProfile) return <div>Could not load participant info</div>;

	return (
		<>
			<div className="absolute top-0 z-50 flex h-16 w-full items-center justify-between bg-sidebar px-4 border-b border-sidebar-border">
				<div className="flex items-center gap-3">
					<div className="relative">
						<Image
							width={40}
							height={40}
							src={participantProfile.photoUrl}
							alt={participantProfile.name}
							className="h-10 w-10 rounded-full object-cover"
						/>
						<div
							className={`absolute right-0 bottom-0 h-3 w-3 rounded-full ${
								participantProfile.status === "online"
									? "bg-green-500"
									: "bg-gray-500"
							}`}
						/>
					</div>
					<div>
						<h1 className="font-semibold">{participantProfile.name}</h1>
						<p className="text-muted-foreground text-sm capitalize">
							{participantProfile.status ?? "offline"}
						</p>
					</div>
				</div>
			</div>

			<ScrollArea
				className="flex max-h-screen flex-1 flex-col gap-4 overflow-y-auto px-4"
				ref={scrollAreaRef}
				onLoad={scrollToBottom}
			>
				{/* Rest of the component remains the same */}
				<div className="h-full space-y-4 pt-20 pb-14">
					{messages.map((message: Message, index: number) => {
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
		</>
	);
}
