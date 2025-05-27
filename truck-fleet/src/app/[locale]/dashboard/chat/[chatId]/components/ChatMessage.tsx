import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/Firebase";
import useProfileDoc from "@/hooks/useProfileDoc";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/DropdownMenuVariants";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/message";
import { useChatOptionsStore } from "@/stores/Chats/ChatOptionsStore";
import {
	IconClipboard,
	IconDownload,
	IconEdit,
	IconTrash,
} from "@tabler/icons-react";
import { deleteDoc, doc } from "firebase/firestore";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";
import AudioMessage from "./messages/AudioMessage";
import FileMessage from "./messages/FileMessage";
import ImageMessage from "./messages/ImageMessage";
import LocationMessage from "./messages/LocationMessage";
import TextMessage from "./messages/TextMessage";
import VideoMessage from "./messages/VideoMessage";

export default function ChatMessage({
	message,
	userId,
}: { message: Message; userId: string }) {
	const { profile: senderProfile, loading } = useProfileDoc(message.sender);
	const { chatId } = useParams();
	const { toast } = useToast();
	const [clipboard, setCopyToClipboard] = useCopyToClipboard();
	const docRef = doc(db, "chats", chatId as string, "messages", message.id);
	const { setDocRef, setIsEditing, setMessageValue, openDeleteDialog } =
		useChatOptionsStore();

	const tGeneral = useTranslations("General");
	const t = useTranslations("ChatPage");

	async function copyMessage() {
		setCopyToClipboard(message.content.trim());

		toast({
			title: tGeneral("copiedToClipboard"),
			variant: "success",
			duration: 2000,
		});
	}

	async function editMessage() {
		setIsEditing(true);
		setDocRef(docRef);
		setMessageValue(message.content);
	}

	async function deleteMessage() {
		try {
			await deleteDoc(docRef);
		} catch (e: any) {
			console.log(e);
			toast({
				title: e.message,
			});
			return;
		}

		toast({
			title: t("messageDeleted"),
			variant: "destructive",
		});
	}

	async function downloadImage() {
		const a = document.createElement("a");
		a.href = message.content;
		a.download = "image";
		a.click();
	}

	async function handleDelete(e: React.MouseEvent) {
		const messageRef = doc(db, `chats/${chatId}/messages/${message.id}`);
		if (e.shiftKey) {
			await deleteDoc(messageRef);
			toast({
				title: t("messageDeleted"),
				variant: "destructive",
			});
			return;
		}
		openDeleteDialog(messageRef);
	}

	const [messageOptions, setMessageOptions] = useState<
		{
			icon: typeof IconClipboard;
			label: string;
			isSender: boolean;
			onPress: (e: React.MouseEvent) => Promise<void>;
			danger: boolean;
		}[]
	>([]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const baseOptions = [];

		// Add copy/download options for all users
		if (message.type === "text") {
			baseOptions.push({
				icon: IconClipboard,
				label: "copy",
				isSender: false,
				onPress: copyMessage,
				danger: false,
			});
		} else if (message.type === "image" || message.type === "video") {
			baseOptions.push({
				icon: IconDownload,
				label: "download",
				isSender: false,
				onPress: downloadImage,
				danger: false,
			});
		}

		// Add sender-only options
		if (message.sender === userId) {
			if (message.type === "text") {
				baseOptions.push({
					icon: IconEdit,
					label: "edit",
					isSender: true,
					onPress: (e: React.MouseEvent) => editMessage(),
					danger: false,
				});
			}

			baseOptions.push({
				icon: IconTrash,
				label: "delete",
				isSender: true,
				onPress: handleDelete,
				danger: true,
			});
		}

		setMessageOptions(baseOptions);
	}, [message.type, message.sender, userId]);

	if (loading || senderProfile === null) return <></>;

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				{message.type === "text" && (
					<TextMessage
						key={message.id}
						message={message}
						userId={userId}
						senderProfile={senderProfile}
					/>
				)}

				{message.type === "image" && (
					<ImageMessage
						key={message.id}
						message={message}
						senderProfile={senderProfile}
						userId={userId}
					/>
				)}

				{message.type === "audio" && (
					<AudioMessage
						key={message.id}
						message={message}
						userId={userId}
						senderProfile={senderProfile}
					/>
				)}

				{message.type === "location" && (
					<LocationMessage
						key={message.id}
						message={message}
						userId={userId}
						senderProfile={senderProfile}
					/>
				)}

				{message.type === "video" && (
					<VideoMessage
						key={message.id}
						message={message}
						userId={userId}
						senderProfile={senderProfile}
					/>
				)}

				{message.type === "file" && (
					<FileMessage
						message={message}
						key={message.id}
						senderProfile={senderProfile}
						userId={userId}
					/>
				)}
			</ContextMenuTrigger>

			<ContextMenuContent>
				<motion.div
					variants={dropdownMenuParentVariants}
					initial="hidden"
					animate="visible"
				>
					{messageOptions.map((item) => {
						return (
							<motion.div variants={dropdownMenuVariants} key={item.label}>
								{item.danger && messageOptions.length > 1 && (
									<ContextMenuSeparator />
								)}
								<ContextMenuItem
									className={cn(
										"gap-2",
										item.danger
											? "flex gap-2 border-red-500/50 bg-red-500/5 text-red-800 hover:bg-red-500/50 focus:bg-red-500/50 dark:text-red-200"
											: "",
									)}
									onClick={item.onPress}
								>
									<item.icon />
									{t(item.label as any)}
								</ContextMenuItem>
							</motion.div>
						);
					})}
				</motion.div>
			</ContextMenuContent>
		</ContextMenu>
	);
}
