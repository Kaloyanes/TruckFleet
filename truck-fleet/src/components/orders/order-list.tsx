"use client";
import React from "react";
import { Checkbox } from "../ui/checkbox";
import { useOrderIdContext } from "@/context/order-selected-context";

export default function OrderList({ truckId }: { truckId: string }) {
	const { id, setId } = useOrderIdContext();

	return (
		<div className="">
			<h1>{truckId}</h1>
			{new Array(100).fill(0).map((_, i) => (
				<div key={i} className="flex items-center justify-between p-2 border-b">
					<Checkbox
						checked={id === i.toString()}
						onCheckedChange={(checked) => {
							if (checked) {
								setId(i.toString());
							} else {
								setId("");
							}
						}}
					/>
				</div>
			))}
		</div>
	);
}
