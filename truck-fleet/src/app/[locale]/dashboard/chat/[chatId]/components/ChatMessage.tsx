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
import {
	IconClipboard,
	IconDownload,
	IconEdit,
	IconTrash,
} from "@tabler/icons-react";
import { deleteDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";

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

	const [messageOptions, setMessageOptions] = useState([
		{
			icon: IconTrash,
			label: "delete",
			isSender: true,
			onPress: deleteMessage,
			danger: true,
		},
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (message.type === "text") {
			setMessageOptions((prevOptions) => [
				{
					icon: IconClipboard,
					label: "copy",
					isSender: false,
					onPress: copyMessage,
					danger: false,
				},
				{
					icon: IconEdit,
					label: "edit",
					isSender: true,
					onPress: editMessage,
					danger: false,
				},
				...prevOptions.filter(
					(option) => option.label !== "copy" && option.label !== "edit",
				),
			]);
		} else if (message.type === "image") {
			setMessageOptions((prevOptions) => [
				{
					icon: IconDownload,
					label: "download_image",
					isSender: false,
					onPress: downloadImage,
					danger: false,
				},
				...prevOptions.filter((option) => option.label !== "download_image"),
			]);
		}
	}, []);

	if (loading || senderProfile === null) return <></>;

	return (
		<ContextMenu>
			<div className={"flex flex-row-reverse items-end justify-end gap-2"}>
				<ContextMenuTrigger>
					{message.type === "text" && (
						<div className="flex flex-col">
							<div
								className={`relative flex min-h-13 w-fit min-w-64 max-w-[30vw] flex-col items-start whitespace-break-spaces break-words rounded-3xl rounded-bl-md bg-accent px-4 py-3 ${message.sender === userId ? " bg-sidebar-border" : "bg-secondary"}`}
							>
								<h1 className="font-semibold">{senderProfile?.name}</h1>
								<p>{message.content}</p>
								{message.updatedAt && (
									<p className="pt-2 text-gray-400 text-xs">{t("edited")}</p>
								)}
							</div>
						</div>
					)}

					{message.type === "image" && (
						<Image
							priority
							src={message.content}
							alt={message.sender}
							className="max-w-xs rounded-lg shadow-sm"
							width={320}
							height={320}
							unoptimized
						/>
					)}
				</ContextMenuTrigger>
				<Image
					src={senderProfile?.photoUrl}
					width={40 * 2}
					height={40 * 2}
					alt={senderProfile?.name}
					className=" h-12 w-12 rounded-full object-cover"
				/>
			</div>
			<ContextMenuContent>
				<motion.div
					variants={dropdownMenuParentVariants}
					initial="hidden"
					animate="visible"
				>
					{messageOptions.map((item) => {
						if (item.isSender && message.sender === userId) {
							return (
								<>
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
								</>
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
