import OrderList from "@/components/orders/order-list";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default function OrdersSlug({
	params,
}: { params: { id: string; locale: string } }) {
	unstable_setRequestLocale(params.locale);

	return (
		<div className="w-full">
			<OrderList truckId={params.id} />
		</div>
	);
}
