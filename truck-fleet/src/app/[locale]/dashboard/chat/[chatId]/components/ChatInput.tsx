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
import { useReactMediaRecorder } from "react-media-recorder";
import { v4 as uuidv4 } from "uuid";
import LocationDialog from "@/app/[locale]/dashboard/chat/[chatId]/components/LocationDialog";

export default function ChatInput() {
	const [message, setMessage] = useState("");
	const [showSend, setShowSend] = useState(false);
	const inputRef = useRef<AutosizeTextAreaRef>(null);
	const [user, loadingAuth, errorAuth] = useAuthState(auth);
	const [showLocationDialog, setShowLocationDialog] = useState(false);
	const [isToggleRecording, setIsToggleRecording] = useState(false);
	const [longPressTimeout, setLongPressTimeout] =
		useState<NodeJS.Timeout | null>(null);

	const { openDeleteDialog } = useDeleteMessage();
	const {
		docRef,
		messageValue,
		isEditing,
		setDocRef,
		setIsEditing,
		setMessageValue,
	} = useChatEditContext();
	const t = useTranslations("ChatPage");
	const chatId = useParams().chatId;

	const { openFilePicker, plainFiles, loading } = useFilePicker({
		accept: "image/*",
	});

	const { startRecording, stopRecording, mediaBlobUrl, status, error } =
		useReactMediaRecorder({
			audio: {
				echoCancellation: true,
				noiseSuppression: true,
				sampleRate: 44100,
			},
			mediaRecorderOptions: {
				mimeType: "audio/webm;codecs=opus",
			},
			onStart: () => {
				console.log("Recording started");
			},
			onStop: (blobUrl, blob) => {
				console.log("Recording stopped", { blobUrl, blob });
			},
		});

	const chatDocRef = doc(db, "chats", chatId as string);
	const messagesCollection = collection(db, `chats/${chatId}/messages`);

	useEffect(() => {
		if (error) {
			console.error("Recording error:", error);
		}
		console.log("Recording status:", status);
	}, [error, status]);

	useEffect(() => {
		if (isEditing) inputRef.current?.textArea.focus();
		else inputRef.current?.textArea.blur();
	}, [isEditing]);

	useEffect(() => {
		setMessage(messageValue);
	}, [messageValue]);

	useEffect(() => {
		setShowSend(message.trim().length > 0);
	}, [message]);

	useEffect(() => {
		if (plainFiles.length > 0 && user) {
			handleFileUpload(plainFiles[0]);
		}
	}, [plainFiles, user]);

	useEffect(() => {
		if (mediaBlobUrl && user) {
			handleAudioUpload();
		}
	}, [mediaBlobUrl, user]);

	// Rest of the component logic...
	// (Keep all the existing functions and JSX, just move them after the hooks)

	// Move your existing functions here (sendMessage, editMessage, etc.)

	async function uploadImage() {
		openFilePicker();
	}

	async function handleFileUpload(file: File) {
		const storageRef = ref(storage, `chats/${chatId}/images/${file.name}`);
		try {
			await uploadBytes(storageRef, file);
			const downloadURL = await getDownloadURL(storageRef);
			await addDoc(messagesCollection, {
				content: downloadURL,
				createdAt: new Date(),
				sender: user?.uid,
				type: "image",
			});
			await updateDoc(chatDocRef, {
				lastMessageAt: new Date(),
			});
		} catch (error) {
			console.error("Error uploading image: ", error);
		}
	}

	async function handleAudioUpload() {
		const response = await fetch(mediaBlobUrl);
		const blob = await response.blob();
		const fileName = `${uuidv4()}.mp3`;
		const storageRef = ref(storage, `chats/${chatId}/audio/${fileName}`);
		await uploadBytes(storageRef, blob);
		const downloadURL = await getDownloadURL(storageRef);
		await addDoc(messagesCollection, {
			content: downloadURL,
			createdAt: new Date(),
			sender: user?.uid,
			type: "audio",
		});
		await updateDoc(chatDocRef, {
			lastMessageAt: new Date(),
		});
	}

	async function handleLocationSelect(location: { lat: number; lng: number }) {
		await addDoc(messagesCollection, {
			content: JSON.stringify(location),
			createdAt: new Date(),
			sender: user?.uid,
			type: "location",
		});

		await updateDoc(chatDocRef, {
			lastMessageAt: new Date(),
		});

		setShowLocationDialog(false);
	}

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

	async function startAudioRecording() {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			stream.getTracks().forEach((track) => track.stop());
			startRecording();
		} catch (err) {
			console.error("Error accessing microphone:", err);
		}
	}

	function handleMicrophoneClick() {
		if (status === "recording") {
			stopRecording();
			setIsToggleRecording(false);
		} else {
			startAudioRecording();
			setIsToggleRecording(true);
		}
	}

	function handleMicrophoneMouseDown() {
		const timeout = setTimeout(() => {
			startAudioRecording();
			setLongPressTimeout(null);
		}, 200);
		setLongPressTimeout(timeout);
	}

	function handleMicrophoneMouseUp() {
		if (longPressTimeout) {
			clearTimeout(longPressTimeout);
			setLongPressTimeout(null);
			handleMicrophoneClick();
		} else {
			stopRecording();
		}
	}

	function handleMicrophoneMouseLeave() {
		if (longPressTimeout) {
			clearTimeout(longPressTimeout);
			setLongPressTimeout(null);
		}
		if (status === "recording" && !isToggleRecording) {
			stopRecording();
		}
	}

	const actions = [
		{
			icon: IconMap2,
			label: "location",
			onPress: () => setShowLocationDialog(true),
		},
		{
			icon: IconPhoto,
			label: "photo",
			onPress: uploadImage,
		},
	];

	return (
		<>
			<LocationDialog
				open={showLocationDialog}
				onOpenChange={setShowLocationDialog}
				onLocationSelect={handleLocationSelect}
			/>
			<motion.div className="fixed right-0 bottom-0 left-0 m-2 flex items-center gap-2">
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
							<DropdownMenuTrigger asChild>
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
						className="absolute top-0 right-0 "
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
							clicked: {
								filter: "blur(0px)",
								scale: 0.9,
								x: 0,
							},
							hovered: {
								filter: "blur(0px)",
								scale: 1.1,
								x: 0,
							},
						}}
						whileTap={"clicked"}
						whileHover={"hovered"}
						animate={isEditing ? "hidden" : "visible"}
					>
						<Button
							size={"icon"}
							variant={status === "recording" ? "default" : "outline"}
							onClick={(e) => e.preventDefault()} // Prevent default to handle mouse events
							onMouseDown={handleMicrophoneMouseDown}
							onMouseUp={handleMicrophoneMouseUp}
							onMouseLeave={handleMicrophoneMouseLeave}
							disabled={error !== ""}
						>
							<IconMicrophone />
						</Button>
					</motion.div>
					<motion.div
						className="absolute top-2 right-2 h-3 w-3 rounded-full bg-red-500"
						variants={{
							recording: {
								opacity: [0.5, 1],
								scale: [0.8, 1.2],
							},
							idle: {
								opacity: 0,
								scale: 0,
							},
						}}
						initial="idle"
						// animate="recording"
						animate={status === "recording" ? "recording" : "idle"}
						transition={{
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
							duration: 1,
							ease: "easeInOut",
						}}
					/>
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
