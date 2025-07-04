import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { setRequestLocale } from "next-intl/server";
import React from "react";
import TruckMap from "./components/TruckMap";

export default async function MapPage(props: {
	params: Promise<{ locale: string }>;
}) {
	const params = await props.params;

	const { locale } = params;

	setRequestLocale(locale);

	return (
		<div className="relative h-full w-full bg-background">
			<TruckMap />
		</div>
	);
}
