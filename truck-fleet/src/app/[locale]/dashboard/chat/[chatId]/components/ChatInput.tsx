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
import { auth, db } from "@/firebase/firebase";
import {
	IconMap2,
	IconMicrophone,
	IconPhoto,
	IconPlus,
	IconSend2,
} from "@tabler/icons-react";
import { addDoc, collection } from "firebase/firestore";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export default function ChatInput() {
	const [message, setMessage] = useState("");
	const [showSend, setShowSend] = useState(false);
	const chatId = useParams().chatId;

	const [user, loadingAuth, errorAuth] = useAuthState(auth);

	useEffect(() => {
		setShowSend(message.trim().length > 0);
	}, [message]);

	if (loadingAuth) return <Spinner />;

	const messagesCollection = collection(db, `chats/${chatId}/messages`);

	async function sendMessage(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		if (e.key !== "Enter") {
			return;
		}

		e.preventDefault();
		if (!showSend) {
			return;
		}
		const tempMessage = message;
		setMessage("");

		console.log(message);
		await addDoc(messagesCollection, {
			content: tempMessage,
			createdAt: new Date(),
			sender: user?.uid,
			type: "text",
		});
	}

	return (
		<motion.div
			className="fixed right-0 bottom-0 left-0 m-2 flex items-center gap-2"
			initial={{
				y: 50,
				opacity: 0,
				gap: -10,
			}}
			animate={{
				y: 0,
				gap: 8,
				opacity: 1,
				transition: {
					type: "spring",
					bounce: 0.15,
				},
			}}
		>
			<motion.div
				className="flex items-center gap-2"
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
			>
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button size={"icon"} variant={"outline"}>
							<IconPlus />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<motion.div
							variants={{
								hidden: {},
								visible: {
									transition: {
										staggerChildren: 0.05,
										delayChildren: 0.05,
									},
								},
							}}
							initial="hidden"
							animate="visible"
						>
							{[
								{
									icon: <IconMap2 />,
									label: "Location",
								},
								{
									icon: <IconPhoto />,
									label: "Photo",
								},
							].map((item) => {
								return (
									<motion.div
										key={Math.random()}
										variants={{
											hidden: { opacity: 0, y: 100, scale: 0.5 },
											visible: { opacity: 1, y: 0, scale: 1 },
										}}
									>
										<DropdownMenuItem
											onClick={() => {
												console.log(
													item.label.toLowerCase().split(" ").join("-"),
												);
											}}
											className="gap-2"
										>
											{item.icon}
											{item.label}
										</DropdownMenuItem>
									</motion.div>
								);
							})}
						</motion.div>
					</DropdownMenuContent>
				</DropdownMenu>
			</motion.div>

			<div className="relative flex-1">
				<AutosizeTextarea
					className="h-10 flex-1 resize-none whitespace-pre-wrap transition-all duration-75 ease-in-out "
					placeholder="Type a message..."
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					maxHeight={100}
					minHeight={30}
					onKeyDown={sendMessage}
				/>
				<Button
					className="absolute top-0 right-0"
					size={"icon"}
					variant={"outline"}
				>
					<IconMicrophone />
				</Button>
			</div>
			<motion.div
				variants={{
					hidden: { opacity: 0, width: 0, x: 50 },
					visible: { opacity: 1, width: "auto", x: 0 },
				}}
				animate={showSend ? "visible" : "hidden"}
			>
				<Button className="ml-2" size={"icon"} disabled={!showSend}>
					<IconSend2 />
				</Button>
			</motion.div>
		</motion.div>
	);
}
