import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useCopyToClipboard } from "react-use";
import { deleteDoc, doc } from "firebase/firestore";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
	IconClipboard,
	IconDownload,
	IconEdit,
	IconTrash,
} from "@tabler/icons-react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/components/ui/use-toast";
import { useChatEditContext } from "@/context/chat/chat-edit-context";
import { db } from "@/firebase/firebase";
import useProfileDoc from "@/hooks/useProfileDoc";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/dropdownMenuVariants";
import { cn } from "@/lib/utils";
import type { Message } from "@/models/message";
import TextMessage from "./messages/TextMessage";
import ImageMessage from "./messages/ImageMessage";

export default function ChatMessage({
	message,
	userId,
}: { message: Message; userId: string }) {
	const { profile: senderProfile, loading } = useProfileDoc(message.sender);
	const { chatId } = useParams();
	const { toast } = useToast();
	const [clipboard, setCopyToClipboard] = useCopyToClipboard();
	const docRef = doc(db, "chats", chatId as string, "messages", message.id);
	const { setDocRef, setIsEditing, setMessageValue } = useChatEditContext();

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

	const [messageOptions, setMessageOptions] = useState<
		{
			icon: typeof IconClipboard;
			label: string;
			isSender: boolean;
			onPress: () => Promise<void>;
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
		} else if (message.type === "image") {
			baseOptions.push({
				icon: IconDownload,
				label: "download_image",
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
					onPress: editMessage,
					danger: false,
				});
			}

			baseOptions.push({
				icon: IconTrash,
				label: "delete",
				isSender: true,
				onPress: deleteMessage,
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
						console.log({ isSender: message.sender === userId, message });
						if (item.isSender && message.sender === userId) {
							return (
								<motion.div variants={dropdownMenuVariants} key={item.label}>
									{item.danger && <ContextMenuSeparator />}
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
						}

						return (
							<motion.div key={item.label} variants={dropdownMenuVariants}>
								<ContextMenuItem className="gap-2" onClick={item.onPress}>
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
