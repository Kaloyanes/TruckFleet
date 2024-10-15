import OrderList from "@/app/[locale]/dashboard/orders/components/OrderList";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default function OrdersSlug({
	params,
}: { params: { chatId: string; locale: string } }) {
	unstable_setRequestLocale(params.locale);

	return (
		<div className="w-full">
			<h1>Hello World</h1>
		</div>
	);
}
