import LoadingSpinner from "@/components/ui/loading-spinner";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default function OrdersPage({ params }: { params: { locale: string } }) {
	unstable_setRequestLocale(params.locale);
	return <></>;
}
