"use client";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function ChatInput() {
	return (
		<motion.div
			className="fixed right-0 bottom-0 left-0 m-2"
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
			<Input placeholder="Type a message..." />
		</motion.div>
	);
}
