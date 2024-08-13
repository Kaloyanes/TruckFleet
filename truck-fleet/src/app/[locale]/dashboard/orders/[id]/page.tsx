import OrderList from "@/components/orders/order-list";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default function OrdersSlug({
	params,
}: { params: { id: string; locale: string } }) {
	unstable_setRequestLocale(params.locale);

	return (
		<>
			<OrderList truckId={params.id} />
		</>
	);
}
