import OrderList from "@/app/[locale]/dashboard/orders/components/OrderList";
import { setRequestLocale, unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default async function OrdersSlug({
	params: { locale, id },
}: { params: { locale: string; id: string } }) {
	setRequestLocale(locale);

	return (
		<div className="w-full">
			<OrderList truckId={id} />
		</div>
	);
}
