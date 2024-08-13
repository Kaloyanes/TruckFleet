import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default function DriversPage({
	params: { locale },
}: { params: { locale: string } }) {
	unstable_setRequestLocale(locale);

	return <div>DriversPage</div>;
}
