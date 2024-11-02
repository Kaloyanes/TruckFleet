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
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDots, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

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
		setTimeout(() => {
			if (bottomRef.current) {
				bottomRef.current.scrollIntoView({
					behavior: "auto",
				});
			}
		}, 70);
	}

	if (userLoading || messagesLoading || chatLoading || profileLoading) {
		return <Spinner />;
	}

	if (messagesError) return <div>Error: {messagesError.message}</div>;
	if (chatError) return <div>Error: {chatError.message}</div>;
	if (!messages) return <div>Get the conversation going</div>;
	if (!participantProfile) return <div>Could not load participant info</div>;

	const actions = [
		{
			label: "Delete Chat",
			icon: <IconTrash />,
			danger: true,
			onClick: () => {
				console.log("Delete chat");
			},
		},
	];

	return (
		<>
			<div className="absolute top-0 z-50 flex h-16 w-full items-center justify-between border-sidebar-border border-b bg-sidebar px-4">
				<div className="flex w-full items-center gap-3">
					<div className="relative">
						<Image
							width={40}
							height={40}
							src={participantProfile.photoUrl}
							alt={participantProfile.name}
							className="h-10 w-10 rounded-full object-cover"
						/>
					</div>
					<div>
						<h1 className="font-semibold">{participantProfile.name}</h1>
					</div>
				</div>
				<div className="justify-self-end">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size={"icon"}>
								<IconDotsVertical />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{actions.map((action, index) => {
								return (
									<>
										{action.danger && actions.length > 1 && (
											<DropdownMenuSeparator />
										)}
										<DropdownMenuItem
											key={index}
											onClick={action.onClick}
											className={cn(
												"gap-2",
												action.danger
													? "border-red-500/50 bg-red-500/5 text-red-800 hover:bg-red-500/50 focus:bg-red-500/50 dark:text-red-200"
													: "",
											)}
										>
											{action.icon}
											<span>{action.label}</span>
										</DropdownMenuItem>
									</>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<ScrollArea
				className="h-screen pt-20"
				ref={scrollAreaRef}
				onLoad={scrollToBottom}
			>
				<div className="space-y-4 px-4 pb-14">
					{messages.map((message: Message, index: number) => {
						return (
							<div
								className="scroll-me-14"
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
