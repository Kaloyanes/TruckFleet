import OrderList from "@/components/orders/order-list";
import React from "react";

export default function OrdersSlug({ params }: { params: { id: string } }) {
	return (
		<>
			<OrderList truckId={params.id} />
		</>
	);
}
