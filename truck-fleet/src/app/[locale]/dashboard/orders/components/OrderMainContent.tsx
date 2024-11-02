"use client";
import { useEditOrderContext } from "@/context/orders/order-edit-context";
import { useOrderIdContext } from "@/context/orders/order-selected-context";
import type React from "react";
import { Card, CardHeader } from "../../../../../components/ui/card";
import TimeTitle from "./TimeTitle";
import TruckTabs from "./TruckTabs";
import AddOrdersSheet from "./add-order/AddOrdersSheet";

export default function OrdersMainContent({
	children,
}: {
	children: React.ReactNode;
}) {
	const { order: id } = useOrderIdContext();

	return (
		<Card
			className={`relative w-full flex-1 overflow-hidden rounded-none border-0 border-border border-l bg-background backdrop-saturate-150 transition-all duration-300 ${id ? "rounded-r-none border-r-0" : "rounded-r-lg "} `}
		>
			<CardHeader className="sticky top-0 flex flex-row items-center justify-between border-b bg-sidebar ">
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
