"use client";
import React, { useMemo } from "react";
import useProfileDoc from "@/hooks/useProfileDoc";
import Link from "next/link";

interface ChatItemProps {
	chat: any;
	currentUserId: string | undefined;
	chatId: string;
}

export default function ChatItem({
	chat,
	currentUserId,
	chatId,
}: ChatItemProps) {
	// Get the other participant's ID
	const participantId = chat.participants.find((p: any) => p !== currentUserId);

	// Fetch the profile of the other participant
	const { profile, loading, error } = useProfileDoc(participantId);

	const renderStatus = useMemo(() => {
		return (status: string) => {
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
		};
	}, []);

	// Handle loading and error states
	if (loading) return <div>Loading profile...</div>;
	if (error) return <div>Error loading profile</div>;
	if (!profile) return <div>Loading...</div>;
	console.log(chat);

	return (
		<Link href={`/chat/${chatId}`}>
			<div
				key={chat.id}
				className="my-2 flex items-center space-x-2 rounded-full p-1 transition-all hover:bg-gray-700"
			>
				<div className="relative">
					<img
						src={profile.photoUrl}
						alt={profile.name}
						className="h-12 w-12 rounded-full"
					/>
					{renderStatus(profile.status)}
				</div>
				<div>
					<h3>{profile.name}</h3>
				</div>
			</div>
		</Link>
	);
}
