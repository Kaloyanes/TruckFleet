import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/firebase/firebase";
import useProfileDoc from "@/hooks/useProfileDoc";
import { cn } from "@/lib/utils";
import type { Message } from "@/models/message";
import { IconClipboard, IconEdit, IconTrash } from "@tabler/icons-react";
import { deleteDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useParams } from "next/navigation";
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

	const tGeneral = useTranslations("General");
	const t = useTranslations("ChatPage");

	function copyMessage() {
		setCopyToClipboard(message.content.trim());

		toast({
			title: tGeneral("copiedToClipboard"),
			variant: "success",
			duration: 2000,
		});
	}

	console.log(docRef);

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
		});
	}

	const messageOptions = [
		{
			icon: IconClipboard,
			label: "Copy",
			isSender: false,
			onPress: copyMessage,
			danger: false,
		},
		{
			icon: IconEdit,
			label: "Edit",
			isSender: true,
			onPress: () => {},
			danger: false,
		},
		{
			icon: IconTrash,
			label: "Delete",
			isSender: true,
			onPress: deleteMessage,
			danger: true,
		},
	];

	if (loading || senderProfile === null) return <></>;

	return (
		<ContextMenu>
			<div className={"flex flex-row-reverse items-end justify-end gap-2"}>
				<ContextMenuTrigger>
					<div className="flex flex-col">
						<div
							className={`relative flex min-h-13 w-fit min-w-64 max-w-[30vw] flex-col items-start whitespace-break-spaces break-words rounded-3xl rounded-bl-none bg-secondary px-4 py-3 ${message.sender === userId ? " bg-sidebar-border" : "bg-secondary"}`}
						>
							<h1 className="font-semibold">{senderProfile?.name}</h1>
							<p>{message.content}</p>
						</div>
					</div>
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
					variants={{
						hidden: {},
						visible: {
							transition: {
								staggerChildren: 0.03,
								delayChildren: 0.05,
							},
						},
					}}
					initial="hidden"
					animate="visible"
				>
					{messageOptions.map((item) => {
						if (item.isSender && message.sender === userId) {
							return (
								<motion.div
									variants={{
										hidden: { opacity: 0, y: 100, scale: 0.5 },
										visible: { opacity: 1, y: 0, scale: 1 },
									}}
									key={item.label}
								>
									<ContextMenuItem
										className={cn(
											"gap-2",
											item.danger
												? "flex gap-2 border-red-500/50 bg-red-500/15 text-red-800 hover:bg-red-500/50 focus:bg-red-500/50 dark:text-red-200"
												: "",
										)}
									>
										<item.icon />
										{item.label}
									</ContextMenuItem>
								</motion.div>
							);
						}

						return (
							<motion.div
								key={item.label}
								variants={{
									hidden: { opacity: 0, y: 100, scale: 0.5 },
									visible: { opacity: 1, y: 0, scale: 1 },
								}}
							>
								<ContextMenuItem className="gap-2" onClick={item.onPress}>
									<item.icon />
									{item.label}
								</ContextMenuItem>
							</motion.div>
						);
					})}
				</motion.div>
			</ContextMenuContent>
		</ContextMenu>
	);
}
