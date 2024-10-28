"use client";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/loading-spinner";
import { useChatEditContext } from "@/context/chat/chat-edit-context";
import { auth, db } from "@/firebase/firebase";
import {
	dropdownMenuParentVariants,
	dropdownMenuVariants,
} from "@/lib/dropdownMenuVariants";
import {
	IconMap2,
	IconMicrophone,
	IconPhoto,
	IconPlus,
	IconSend2,
	IconX,
} from "@tabler/icons-react";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ChatInput() {
	const [message, setMessage] = useState("");
	const [showSend, setShowSend] = useState(false);
	const chatId = useParams().chatId;
	const t = useTranslations("ChatPage");
	const {
		docRef,
		messageValue,
		isEditing,
		setDocRef,
		setIsEditing,
		setMessageValue,
	} = useChatEditContext();

	const [user, loadingAuth, errorAuth] = useAuthState(auth);

	const messagesCollection = collection(db, `chats/${chatId}/messages`);

	const actions = [
		{
			icon: IconMap2,
			label: "location",
		},
		{
			icon: IconPhoto,
			label: "photo",
		},
	];

	useEffect(() => {
		setMessage(messageValue);
	}, [messageValue]);

	useEffect(() => {
		setShowSend(message.trim().length > 0);
	}, [message]);

	if (loadingAuth) return <Spinner />;

	async function sendMessage(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key === "Escape" && isEditing) {
			cancelEdit();
			return;
		}

		if (e.key !== "Enter") {
			return;
		}

		e.preventDefault();
		if (!showSend) {
			return;
		}

		const tempMessage = message;
		setMessage("");

		if (isEditing && docRef) await editMessage(tempMessage);
		else await uploadMessage(tempMessage);
	}

	async function uploadMessage(content: string) {
		await addDoc(messagesCollection, {
			content,
			createdAt: new Date(),
			sender: user?.uid,
			type: "text",
		});
	}

	async function editMessage(content: string) {
		if (!docRef) return;
		await updateDoc(docRef, {
			content,
			updatedAt: new Date(),
		});

		cancelEdit();
	}

	function cancelEdit() {
		setMessage("");
		setMessageValue("");
		setIsEditing(false);
		setDocRef(null);
	}

	return (
		<>
			<motion.div
				className="fixed right-0 bottom-0 left-0 m-2 flex items-center gap-2"
				initial={{
					y: 50,
					opacity: 0,
				}}
				animate={{
					y: 0,
					opacity: 1,
				}}
			>
				<div className="flex items-center">
					<motion.div
						className="flex items-center gap-2"
						variants={{
							hidden: {
								opacity: 0,
								x: 100,
								width: 0,
							},
							visible: {
								opacity: 1,
								x: 0,
								width: "auto",
							},
						}}
						initial="hidden"
						animate={isEditing ? "hidden" : "visible"}
					>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button size={"icon"} variant={"outline"}>
									<IconPlus />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<motion.div
									variants={dropdownMenuParentVariants}
									initial="hidden"
									animate="visible"
								>
									{actions.map((item) => {
										return (
											<motion.div
												key={Math.random()}
												variants={dropdownMenuVariants}
											>
												<DropdownMenuItem
													onClick={() => {
														console.log(
															item.label.toLowerCase().split(" ").join("-"),
														);
													}}
													className="gap-2"
												>
													{item.icon && <item.icon />}
													{t(item.label as any)}
												</DropdownMenuItem>
											</motion.div>
										);
									})}
								</motion.div>
							</DropdownMenuContent>
						</DropdownMenu>
					</motion.div>

					<motion.div
						className="flex items-center gap-2"
						variants={{
							hidden: { opacity: 0, width: 0, x: 100 },
							visible: { opacity: 1, width: "auto", x: 0 },
						}}
						animate={isEditing ? "visible" : "hidden"}
					>
						<Button
							size={"icon"}
							disabled={!isEditing}
							variant={"outline"}
							onClick={cancelEdit}
						>
							<IconX />
						</Button>
					</motion.div>
				</div>

				<div className="relative flex-1">
					<AutosizeTextarea
						className="h-10 flex-1 resize-none whitespace-pre-wrap transition-all duration-75 ease-in-out "
						placeholder={t("type")}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						maxHeight={100}
						minHeight={30}
						onKeyDown={sendMessage}
					/>
					<motion.div
						className="absolute top-0 right-0"
						variants={{
							hidden: {
								opacity: 0,
								width: 0,
								scale: 0,
								x: -25,
							},
							visible: {
								opacity: 1,
								width: "auto",
								scale: 1,
								x: 0,
							},
						}}
						initial="hidden"
						animate={isEditing ? "hidden" : "visible"}
					>
						<Button size={"icon"} variant={"outline"}>
							<IconMicrophone />
						</Button>
					</motion.div>
				</div>

				<motion.div
					variants={{
						hidden: { opacity: 0, width: 0, x: 50 },
						visible: { opacity: 1, width: "auto", x: 0 },
					}}
					animate={showSend ? "visible" : "hidden"}
				>
					<Button size={"icon"} disabled={!showSend}>
						<IconSend2 />
					</Button>
				</motion.div>
			</motion.div>
		</>
	);
}
