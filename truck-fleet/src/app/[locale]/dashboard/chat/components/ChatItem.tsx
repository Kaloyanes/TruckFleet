"use client";
import { Spinner } from "@/components/ui/loading-spinner";
import useProfileDoc from "@/hooks/useProfileDoc";
import { Link } from "@/lib/navigation";
import type { Chat } from "@/models/chat";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";

interface ChatItemProps {
	chat: Chat;
	currentUserId: string | undefined;
	chatId: string;
}

export default function ChatItem({
	chat,
	currentUserId,
	chatId,
}: ChatItemProps) {
	// Get the other participant's ID
	const participantId = chat.participants.find(
		(p: string) => p !== currentUserId,
	);

	// Fetch the profile of the other participant
	const { profile, loading, error } = useProfileDoc(participantId);

	// const renderStatus = useMemo(() => {
	// 	return (status: string) => {
	// 		switch (status) {
	// 			case "online":
	// 				return (
	// 					<div className="absolute right-0 bottom-0 h-4 w-4 rounded-full bg-green-500" />
	// 				);
	// 			case "offline":
	// 				return (
	// 					<div className="absolute right-0 bottom-0 h-4 w-4 rounded-full bg-gray-500" />
	// 				);
	// 			default:
	// 				return null;
	// 		}
	// 	};
	// }, []);

	const params = useParams();

	// Handle loading and error states
	if (loading) return <div>Loading profile...</div>;
	if (error) return <div>Error loading profile</div>;
	if (!profile) return <Spinner />;

	return (
		<Link href={`/dashboard/chat/${chatId}`}>
			<div
				key={chatId}
				className={`my-1 flex items-center gap-3 rounded-full rounded-r-none p-1 transition-all ease-in-out ${chatId === params.chatId ? "bg-muted font-semibold" : "hover:bg-muted/50"}`}
			>
				<div className="relative">
					<Image
						width={48 * 2}
						height={48 * 2}
						src={profile.photoUrl}
						alt={profile.name}
						className="h-12 w-12 rounded-full object-cover"
					/>
					{/* {renderStatus(profile.status)} */}
				</div>
				<div>
					<h3>{profile.name}</h3>
				</div>
			</div>
		</Link>
	);
}
