"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconSend } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ChatInput() {
	const [message, setMessage] = useState("");
	const [showSend, setShowSend] = useState(false);

	useEffect(() => {
		setShowSend(message.length > 0);
	}, [message]);

	return (
		<motion.div
			className="fixed right-0 bottom-0 left-0 m-2 flex items-center"
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
					bounce: 0.2,
					type: "spring",
					duration: 0.7,
				},
			}}
		>
			<Input
				className="flex-1"
				placeholder="Type a message..."
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			/>
			<motion.div className="flex-[0.02]">
				<Button className="ml-2" size={"icon"} disabled={!showSend}>
					<IconSend />
				</Button>
			</motion.div>
		</motion.div>
	);
}
