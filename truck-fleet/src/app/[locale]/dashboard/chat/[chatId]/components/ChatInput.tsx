"use client";
import {
	type AutosizeTextAreaRef,
	AutosizeTextarea,
} from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/loading-spinner";
import { useChatEditContext } from "@/context/chat/chat-edit-context";
import { auth, db, storage } from "@/firebase/firebase";
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
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useFilePicker } from "use-file-picker";
import { useDeleteMessage } from "@/context/chat/delete-message-context";

export default function ChatInput() {
	const { openFilePicker, plainFiles, loading } = useFilePicker({
		accept: "image/*",
	});
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
	const inputRef = useRef<AutosizeTextAreaRef>(null);

	const [user, loadingAuth, errorAuth] = useAuthState(auth);

	const chatDocRef = doc(db, "chats", chatId as string);
	const messagesCollection = collection(db, `chats/${chatId}/messages`);

	async function uploadImage() {
		openFilePicker();
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (plainFiles.length > 0 && user) {
			const file = plainFiles[0];
			const storageRef = ref(storage, `chats/${chatId}/images/${file.name}`);
			uploadBytes(storageRef, file)
				.then(() => getDownloadURL(storageRef))
				.then(async (downloadURL) => {
					await addDoc(messagesCollection, {
						content: downloadURL,
						createdAt: new Date(),
						sender: user?.uid,
						type: "image",
					});
					return updateDoc(chatDocRef, {
						lastMessageAt: new Date(),
					});
				})
				.catch((error) => {
					console.error("Error uploading image: ", error);
				});
		}
	}, [plainFiles, user]);

	const actions = [
		{
			icon: IconMap2,
			label: "location",
			onPress: () => {},
		},
		{
			icon: IconPhoto,
			label: "photo",
			onPress: uploadImage,
		},
	];

	useEffect(() => {
		console.log({ inputRef, isEditing });
		if (isEditing) inputRef.current?.textArea.focus();
		else inputRef.current?.textArea.blur();
	}, [isEditing]);

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

		updateDoc(chatDocRef, {
			lastMessageAt: new Date(),
		});
	}

	async function uploadMessage(content: string) {
		await addDoc(messagesCollection, {
			content,
			createdAt: new Date(),
			sender: user?.uid,
			type: "text",
		});
	}

	const { openDeleteDialog } = useDeleteMessage();

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
				// initial={{
				// 	opacity: 0,
				// 	filter: "blur(10px)",
				// }}
				// animate={{
				// 	opacity: 1,
				// 	filter: "blur(0px)",
				// }}
			>
				<div className="flex items-center">
					<motion.div
						className="flex items-center gap-2"
						variants={{
							hidden: {
								opacity: 0,
								x: 100,
								width: 0,
								filter: "blur(10px)",
							},
							visible: {
								opacity: 1,
								x: 0,
								width: "auto",
								filter: "blur(0px)",
							},
						}}
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
													onClick={item.onPress}
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
							hidden: { opacity: 0, filter: "blur(10px)", width: 0, x: 100 },
							visible: {
								opacity: 1,
								filter: "blur(0px)",
								width: "auto",
								x: 0,
							},
						}}
						initial="hidden"
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
						ref={inputRef}
						className="h-10 flex-1 resize-none whitespace-pre-wrap transition-all duration-75 ease-in-out "
						placeholder={t("type")}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						maxHeight={100}
						minHeight={30}
						onKeyDown={sendMessage}
						onLoad={(e) => {
							inputRef.current?.textArea.focus();
						}}
					/>
					<motion.div
						className="absolute top-0 right-0"
						variants={{
							hidden: {
								opacity: 0,
								width: 0,
								scale: 0,
								x: -25,
								filter: "blur(10px)",
							},
							visible: {
								opacity: 1,
								width: "auto",
								scale: 1,
								x: 0,
								filter: "blur(0px)",
							},
						}}
						animate={isEditing ? "hidden" : "visible"}
					>
						<Button size={"icon"} variant={"outline"}>
							<IconMicrophone />
						</Button>
					</motion.div>
				</div>

				<motion.div
					variants={{
						hidden: {
							opacity: 1,
							filter: "blur(10px)",
							width: 0,
							x: 50,
							scale: 0.7,
						},
						visible: {
							opacity: 1,
							filter: "blur(0px)",
							width: "auto",
							x: 0,
							scale: 1,
						},
					}}
					initial="hidden"
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
