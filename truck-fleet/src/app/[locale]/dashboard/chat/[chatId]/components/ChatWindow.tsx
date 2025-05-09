"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/loading-spinner";
import { auth, db } from "@/lib/Firebase";
import {
	collection,
	doc,
	orderBy,
	query,
	limit,
	startAfter,
	getDocs,
	getDoc,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollectionData,
	useDocumentData,
} from "react-firebase-hooks/firestore";
import Image from "next/image";
import ChatMessage from "./ChatMessage";
import type { Message } from "@/types/message";
import useProfileDoc from "@/hooks/useProfileDoc";
import type { Chat } from "@/types/chat";
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
import { ChatConverter } from "@/lib/converters/ChatConverter";
import { MessageConverter } from "@/lib/converters/MessageConverter";
import { useChatStore } from "@/stores/Chats/ChatStore";
import { useRouter } from "@/i18n/routing";

export default function ChatWindow() {
	// --- Hooks moved to the top ---
	const chatId = useParams().chatId as string;
	const [user, userLoading] = useAuthState(auth);
	const [messages, setMessages] = useState<Message[]>([]);
	const [loadingMore, setLoadingMore] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const lastVisibleDocRef = useRef<any>(null); // Ref to store the last document snapshot for pagination
	const observerRef = useRef<IntersectionObserver | null>(null);
	const loadingRef = useRef<HTMLDivElement>(null);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const { deleteChat, isDeleting } = useChatStore();
	const router = useRouter();

	// Get chat document with participant info
	const [chatDoc, chatLoading, chatError] = useDocumentData(
		doc(db, "chats", chatId).withConverter(ChatConverter),
	);

	// Get the other participant's profile
	const participantId = chatDoc?.participants.find(
		(p: string) => p !== user?.uid,
	);
	const { profile: participantProfile, loading: profileLoading } =
		useProfileDoc(participantId);

	// Initial messages query
	const initialMessagesQuery = query(
		collection(db, "chats", chatId, "messages"),
		orderBy("createdAt", "desc"),
		limit(20),
	).withConverter(MessageConverter);

	const [initialMessages, messagesLoading, messagesError] =
		useCollectionData(initialMessagesQuery);

	// --- End of hooks ---

	// Load more messages function
	const loadMoreMessages = useCallback(async () => {
		if (loadingMore || !hasMore || !lastVisibleDocRef.current) return;

		setLoadingMore(true);
		try {
			const messagesRef = collection(db, "chats", chatId, "messages");
			// Fetch the actual snapshot to use with startAfter
			const lastSnapshot = await getDoc(
				doc(messagesRef, lastVisibleDocRef.current.id),
			);

			const q = query(
				messagesRef,
				orderBy("createdAt", "desc"),
				startAfter(lastSnapshot), // Use the actual snapshot
				limit(10),
			).withConverter(MessageConverter);

			const snapshot = await getDocs(q);
			const newMessages = snapshot.docs.map((doc) => doc.data());

			if (snapshot.docs.length > 0) {
				lastVisibleDocRef.current = snapshot.docs[snapshot.docs.length - 1]; // Update last visible doc snapshot
				// Prepend new messages to maintain order (since query is desc)
				setMessages((prev) => [...newMessages.reverse(), ...prev]);
			} else {
				setHasMore(false);
			}
		} catch (error) {
			console.error("Error loading more messages:", error);
		} finally {
			setLoadingMore(false);
		}
	}, [chatId, loadingMore, hasMore]); // Keep dependencies as they affect the function logic

	// Set up intersection observer
	useEffect(() => {
		const currentLoadingRef = loadingRef.current;
		if (!currentLoadingRef) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasMore && !loadingMore) {
					loadMoreMessages();
				}
			},
			{ threshold: 0.1, root: scrollAreaRef.current },
		);

		observer.observe(currentLoadingRef);
		observerRef.current = observer;

		return () => {
			if (currentLoadingRef) {
				observer.unobserve(currentLoadingRef);
			}
			observer.disconnect();
			observerRef.current = null;
		};
	}, [loadMoreMessages, hasMore, loadingMore]); // Keep dependencies as they control the effect's execution

	// Initialize messages and last visible doc ref
	useEffect(() => {
		if (initialMessages) {
			// Reverse initial messages to display oldest first at the top
			setMessages(initialMessages.slice().reverse());
			if (initialMessages.length > 0) {
				// Fetch initial docs again to get snapshots for pagination
				getDocs(initialMessagesQuery).then((snapshot) => {
					if (!snapshot.empty) {
						lastVisibleDocRef.current = snapshot.docs[snapshot.docs.length - 1];
					}
				});
			} else {
				setHasMore(false);
			}
		}
	}, [initialMessages]); // Remove initialMessagesQuery, only depends on the data itself

	// Scroll to bottom function
	const scrollToBottom = useCallback(() => {
		requestAnimationFrame(() => {
			const viewport = scrollAreaRef.current?.querySelector(
				"[data-radix-scroll-area-viewport]",
			);
			if (viewport) {
				viewport.scrollTop = viewport.scrollHeight;
			}
		});
	}, []);

	// Scroll to bottom effect
	useEffect(() => {
		if (messages.length > 0 && !loadingMore) {
			scrollToBottom();
		}
	}, [messages, scrollToBottom]); // Remove loadingMore, scroll should happen when messages change

	// --- Conditional returns ---
	if (userLoading || chatLoading || profileLoading || messagesLoading) {
		return <Spinner />;
	}

	if (messagesError)
		return <div>Error loading messages: {messagesError.message}</div>;
	if (chatError) return <div>Error loading chat: {chatError.message}</div>;
	if (!participantProfile) return <div>Could not load participant info</div>;

	// --- Component logic using hooks ---
	const handleDeleteChat = async () => {
		const navigateHome = () => router.push("/dashboard/chat");
		await deleteChat(chatId, navigateHome);
	};

	const actions = [
		{
			label: "Delete Chat",
			icon: IconTrash,
			danger: true,
			onClick: handleDeleteChat,
		},
	];

	// --- Return JSX ---
	return (
		<>
			<div className="absolute top-0 z-50 flex h-16 w-full items-center justify-between border-sidebar-border border-b bg-sidebar px-3">
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
							<Button variant="ghost" size={"icon"} disabled={isDeleting}>
								{isDeleting ? <Spinner size="small" /> : <IconDotsVertical />}{" "}
								{/* Fixed spinner size */}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{actions.map((action) => (
								<div key={action.label}>
									{action.danger && actions.length > 1 && (
										<DropdownMenuSeparator />
									)}
									<DropdownMenuItem
										onClick={action.onClick}
										disabled={isDeleting}
										className={cn(
											"gap-2",
											action.danger
												? "border-red-500/50 bg-red-500/5 text-red-800 hover:bg-red-500/50 focus:bg-red-500/50 dark:text-red-200"
												: "",
										)}
									>
										<action.icon className="h-4 w-4" />{" "}
										{/* Instantiated icon */}
										<span>{action.label}</span>
									</DropdownMenuItem>
								</div>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<ScrollArea ref={scrollAreaRef} className="h-screen pt-16">
				<div className="flex flex-col-reverse space-y-4 space-y-reverse p-4 pb-20">
					{/* Messages rendered in reverse order */}
					{messages.map((message) => (
						<ChatMessage
							message={message}
							userId={user?.uid ?? ""}
							key={message.id}
						/>
					))}
					{/* Loading indicator at the top (bottom visually due to reverse) */}
					{hasMore && (
						<div ref={loadingRef} className="flex justify-center py-2">
							{loadingMore && <Spinner />}
						</div>
					)}
					{!hasMore && messages.length === 0 && (
						<div className="text-center text-muted-foreground">
							Start the conversation!
						</div>
					)}
				</div>
			</ScrollArea>
		</>
	);
}
