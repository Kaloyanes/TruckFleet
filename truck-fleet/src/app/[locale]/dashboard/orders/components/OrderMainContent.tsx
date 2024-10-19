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
	const { order, open } = useEditOrderContext();

	return (
		<Card
			className={`border-border border-0 border-l  flex-1 overflow-hidden rounded-none  transition-all  duration-300 w-full  relative backdrop-saturate-150 bg-background  ${id ? "rounded-r-none border-r-0" : "rounded-r-lg "} `}
		>
			<CardHeader className="sticky top-0   border-b flex flex-row justify-between items-center ">
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
