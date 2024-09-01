"use client";
import { AnimatePresence, motion } from "framer-motion";
import React, { useContext } from "react";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { OrderSelectedContext } from "@/context/orders/order-selected-context";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { IconMessage, IconPhone, IconPhoneCall } from "@tabler/icons-react";

export default function OrderSidebar() {
	const orderSelectedContext = useContext(OrderSelectedContext);
	const order = orderSelectedContext?.order;

	const show = orderSelectedContext?.order !== null;

	const [driver, loading, error] = useDocumentDataOnce(
		orderSelectedContext?.order?.driver,
	);

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: "500px" }}
					exit={{ width: 0 }}
					transition={{ duration: 0.3, ease: "circOut" }}
					className={`min-w-0 border-border overflow-hidden w-[500px] rounded-l-none    rounded-lg bg-background/50  backdrop-saturate-150  ${show ? "rounded-full border" : "rounded-none border-0"} `}
				>
					<CardHeader>
						<CardTitle className="min-w-[500px]">
							Order Details #{order?.id}
						</CardTitle>
					</CardHeader>
					<CardContent className="min-w-[500px]">
						<div className="w-full flex gap-4 items-center justify-between">
							<div className="flex gap-4 items-center">
								<Avatar>
									<AvatarImage src={driver?.photoUrl} alt={driver?.name} />
									<AvatarFallback>
										{(driver?.name as string)
											?.split(" ")
											.map((name) => name[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<h2 className="text-lg font-semibold">{driver?.name}</h2>
									<p className="text-sm">{driver?.email}</p>
								</div>
							</div>
							<div className="flex gap-2 self-end">
								<Button variant={"outline"} size={"icon"}>
									<IconPhone />
								</Button>
								<Button variant={"outline"} size={"icon"}>
									<IconMessage />
								</Button>
							</div>
						</div>
					</CardContent>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
