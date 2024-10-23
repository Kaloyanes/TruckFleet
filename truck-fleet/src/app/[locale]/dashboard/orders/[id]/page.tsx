import OrderList from "@/app/[locale]/dashboard/orders/components/OrderList";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default async function OrdersSlug(props: { params: Promise<{ id: string; locale: string }> }) {
    const params = await props.params;
    unstable_setRequestLocale(params.locale);

    return (
		<div className="w-full">
			<OrderList truckId={params.id} />
		</div>
	);
}
