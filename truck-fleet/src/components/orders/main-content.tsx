"use client";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TruckTabs from "./truck-tabs";
import TimeTitle from "./time-title";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import AddOrdersSheet from "./add-order/add-orders-sheet";
import { useEditOrderContext } from "@/context/orders/order-edit-context";
import { useOrderIdContext } from "@/context/orders/order-selected-context";

export default function OrdersMainContent({
	children,
}: { children: React.ReactNode }) {
	const { order: id } = useOrderIdContext();
	const { order, open } = useEditOrderContext();

	return (
		<Card
			className={`border-border border-0 border-l  flex-1 overflow-hidden rounded-none bg-transparent transition-all  duration-300 w-full  relative backdrop-saturate-150   ${id ? "rounded-r-none border-r-0" : "rounded-r-lg "} `}
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
