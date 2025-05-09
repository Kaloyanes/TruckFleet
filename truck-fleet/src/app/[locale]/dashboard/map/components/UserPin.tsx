import { Spinner } from "@/components/ui/loading-spinner";
import type { Driver } from "@/types/driver";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import {
	IconChartArcs,
	IconChartArcs3,
	IconMessage,
} from "@tabler/icons-react";
import { AdvancedMarker } from "@vis.gl/react-google-maps";
import React from "react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/stores/Chats/ChatStore";
import { toast } from "@/components/ui/use-toast";
import { useTranslations } from "next-intl";
import router from "next/router";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function UserPin({
	user,
	currentUser,
	currentUserLoading,
	index,
}: {
	user: Driver;
	currentUser: any;
	currentUserLoading: boolean;
	index: number;
}) {
	const { chats, loadChats, isCreating, createChat } = useChatStore();
	const t = useTranslations("DriverActions");

	const colors = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];

	async function handleCreateChat() {
		// Renamed to avoid conflict
		if (currentUserLoading || !currentUser) {
			// Check current user state
			toast({
				title: t("chatCreationFailed"),
				variant: "destructive",
			});
			return;
		}

		if (currentUser.uid === user.id) {
			// Prevent chatting with self
			toast({
				title: t("chatWithSelfError"),
				variant: "destructive",
			});
			return;
		}

		const participants = [currentUser.uid, user.id]; // Store handles sorting

		// Define the navigation callback
		const navigateToChat = (chatId: string) => {
			router.push(`/dashboard/chat/${chatId}`);
		};

		// Call the store's createChat function
		const existingChat = chats.find(
			(chat) =>
				chat.participants.includes(user.id) &&
				chat.participants.includes(currentUser.uid),
		);

		if (existingChat) {
			navigateToChat(existingChat.id);
			return;
		}

		await createChat(participants, navigateToChat);
	}

	return (
		<Popover key={user.id}>
			<PopoverTrigger asChild>
				<AdvancedMarker
					position={{
						lat: (user.location as any).latitude,
						lng: (user.location as any).longitude,
					}}
					className="relative cursor-pointer rounded-full "
				>
					<Image
						src={user.photoUrl}
						alt={`${user.name} Photo`}
						width={32}
						height={32}
						className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 z-50 aspect-square rounded-full border-2 border-foreground/50 object-cover"
					/>
				</AdvancedMarker>
			</PopoverTrigger>
			<PopoverContent className="flex w-[calc(auto + 5px)] flex-col items-start justify-center text-sm">
				<div className="flex items-center w-full justify-between gap-6">
					<p className="font-semibold">{user.name ?? "Unnamed User"}</p>
					<div className="flex items-center justify-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="size-5"
							onClick={handleCreateChat} // Use the new handler
							disabled={isCreating} // Disable button while creating
						>
							{isCreating ? <Spinner size="small" /> : <IconMessage />}
						</Button>
						<Button variant="ghost" size="icon" className="size-5">
							<IconChartArcs />
						</Button>
					</div>
				</div>
				<p className="text-muted-foreground">{user.email}</p>
				<p className="text-muted-foreground">{user.phone}</p>
			</PopoverContent>
		</Popover>
	);
}
