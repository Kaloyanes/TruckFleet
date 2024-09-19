import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";
import TruckMap from "./components/TruckMap";

export default function MapPage({
	params: { locale },
}: { params: { locale: string } }) {
	// unstable_setRequestLocale(locale);

	return (
		<div className="h-full w-full relative bg-background">
			<TruckMap />
		</div>
	);
}
