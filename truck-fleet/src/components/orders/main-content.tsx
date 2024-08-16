"use client";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TruckTabs from "./truck-tabs";
import TimeTitle from "./time-title";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useOrderIdContext } from "@/context/order-selected-context";
import { Button } from "../ui/button";
import AddOrdersSheet from "./add-order/add-orders-sheet";

export default function OrdersMainContent({
	children,
}: { children: React.ReactNode }) {
	const { id } = useOrderIdContext();

	return (
		<Card
			className={`border-border flex-1 border overflow-hidden rounded-lg bg-transparent transition-all  duration-300 w-full  relative backdrop-saturate-150   ${id ? "rounded-r-none border-r-0" : "rounded-r-lg "} `}
		>
			<CardHeader className="sticky top-0  bg-transparent border-b flex flex-row justify-between items-center ">
				<div>
					<TimeTitle />
					<TruckTabs />
				</div>
				<AddOrdersSheet />
			</CardHeader>

			<div className="w-full">{children}</div>
		</Card>
	);
}
