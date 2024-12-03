import OrderList from "@/app/[locale]/dashboard/orders/components/OrderList";
import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default async function OrdersSlug(props: { params: Promise<{ locale: string; id: string }> }) {
    const params = await props.params;

    const {
        locale,
        id
    } = params;

    setRequestLocale(locale);

    return (
		<div className="w-full">
			<OrderList truckId={id} />
		</div>
	);
}
