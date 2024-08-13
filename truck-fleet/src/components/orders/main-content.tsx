"use client";
import type React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import TruckTabs from "./truck-tabs";
import TimeTitle from "./time-title";
import { ScrollArea } from "../ui/scroll-area";
import { useOrderIdContext } from "@/context/order-selected-context";
import { Button } from "../ui/button";
import AddOrdersSheet from "./add-orders-sheet";

export default function OrdersMainContent({
	children,
}: { children: React.ReactNode }) {
	const { id } = useOrderIdContext();

	return (
		<ScrollArea
			className={`border-border border rounded-lg bg-transparent transition-all overflow-y-hidden duration-300  relative backdrop-saturate-150 w-full ${id ? "rounded-r-none border-r-0" : "rounded-r-lg "} `}
		>
			<CardHeader className="sticky mb-10 top-0 bg-card border-b flex flex-row justify-between items-center">
				<div>
					<TimeTitle />
					<TruckTabs />
				</div>
				<AddOrdersSheet />
			</CardHeader>

			<CardContent>{children}</CardContent>
		</ScrollArea>
	);
}
