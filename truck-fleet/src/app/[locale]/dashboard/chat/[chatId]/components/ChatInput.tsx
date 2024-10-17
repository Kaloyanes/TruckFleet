"use client";
import { AutosizeTextarea } from "@/components/ui/autosize-textarea";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	IconMap2,
	IconMicrophone,
	IconPhoto,
	IconPlus,
	IconSend2,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ChatInput() {
	const [message, setMessage] = useState("");
	const [showSend, setShowSend] = useState(false);

	useEffect(() => {
		setShowSend(message.length > 0);
	}, [message]);

	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.5,
			},
		},
	};

	const item = {
		hidden: { opacity: 0 },
		show: { opacity: 1 },
	};

	return (
		<motion.div
			className="fixed right-0 bottom-0 left-0 m-2 flex items-center gap-2"
			initial={{
				scale: 0.2,
				opacity: 0,
				y: 150,
			}}
			animate={{
				scale: 1,
				opacity: 1,
				y: 0,
				transition: {
					type: "spring",
					bounce: 0.15,
				},
			}}
		>
			<motion.div
				className="flex items-center gap-2"
				initial={{ opacity: 0, x: 50 }}
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
								{
									icon: <IconMicrophone />,
									label: "Voice Message",
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
			<AutosizeTextarea
				className="h-10 flex-1 resize-none whitespace-pre-wrap transition-all duration-75 ease-in-out "
				placeholder="Type a message..."
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				maxHeight={100}
				minHeight={30}
			/>

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
