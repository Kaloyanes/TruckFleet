"use client";
import { auth, db } from "@/firebase/firebase";
import useProfileDoc from "@/hooks/useProfileDoc";
import { collection, orderBy, query, where } from "firebase/firestore";
import React, { Suspense, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import {
	useCollection,
	useCollectionData,
} from "react-firebase-hooks/firestore";
import ChatItem from "./ChatItem";

export default async function ChatUsers() {
	// Use the useAuthState hook to get the current user's authentication state
	const [user, loadingAuth, errorAuth] = useAuthState(auth);

	// Define the query unconditionally, but only run if user is available
	const chatQuery = user
		? query(
				collection(db, "chats"),
				where("participants", "array-contains", user.uid),
				orderBy("lastMessageAt", "desc"),
			)
		: null;

	// Use the useCollectionData hook unconditionally (pass null if no user)
	const [chats, chatLoading, error] = useCollection(chatQuery);
	if (loadingAuth || chatLoading)
		// Handle loading states
		return <div>Loading...</div>;
	if (errorAuth) return <div>Error: {errorAuth.message}</div>;
	if (error) return <div>Error: {error.message}</div>;

	if (!chats || chats.docs.length === 0) {
		return <div>No chats available</div>; // Or a fallback if no chats
	}

	function renderStatus(status: string) {
		switch (status) {
			case "online":
				return (
					<div className="absolute right-1 bottom-0 h-3 w-3 rounded-full bg-green-500" />
				);
			case "offline":
				return (
					<div className="absolute right-1 bottom-0 h-3 w-3 rounded-full bg-gray-500" />
				);
			default:
				return null;
		}
	}

	return (
		<div>
			{chats?.docs.map((chat) =>
				chat ? (
					<ChatItem
						key={chat.id}
						chatId={chat.id}
						chat={chat.data()}
						currentUserId={auth.currentUser?.uid}
					/>
				) : (
					<div key="undefined-chat">Loading chat data...</div>
				),
			)}
		</div>
	);
}
