"use client";
import type React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "../../../../../components/ui/card";
import TruckTabs from "./TruckTabs";
import TimeTitle from "./TimeTitle";
import {
	ScrollArea,
	ScrollBar,
} from "../../../../../components/ui/scroll-area";
import { Button } from "../../../../../components/ui/button";
import AddOrdersSheet from "./add-order/AddOrdersSheet";
import { useEditOrderContext } from "@/context/orders/order-edit-context";
import { useOrderIdContext } from "@/context/orders/order-selected-context";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function OrdersMainContent({
	children,
}: {
	children: React.ReactNode;
}) {
	const { order: id } = useOrderIdContext();
	const { order, open } = useEditOrderContext();

	return (
		<Card
			className={`border-border border-0 border-l  flex-1 overflow-hidden rounded-none  transition-all  duration-300 w-full  relative backdrop-saturate-150   ${id ? "rounded-r-none border-r-0" : "rounded-r-lg "} `}
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
