"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext } from "react";
import { CardHeader } from "../ui/card";
import { OrderSelectedContext } from "@/context/order-selected-context";

export default function OrderSidebar() {
	const orderSelectedContext = useContext(OrderSelectedContext);

	const show = orderSelectedContext?.id;

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: "500px" }}
					exit={{ width: 0 }}
					className={`min-w-0 border-border overflow-hidden w-[500px] rounded-l-none    rounded-lg bg-background/50  backdrop-saturate-150  ${show ? "rounded-full border" : "rounded-none border-0"} `}
				>
					<CardHeader>
						<h1>{show}</h1>
					</CardHeader>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
