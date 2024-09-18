"use client";
import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

export default function MapPage({
	params: { locale },
}: { params: { locale: string } }) {
	// unstable_setRequestLocale(locale);

	return (
		<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
			<GoogleMap
				mapId={"71b489216afed105"}
				style={{ width: "100%", height: "100%" }}
				defaultCenter={{ lat: 22.54992, lng: 0 }}
				defaultZoom={3}
				gestureHandling={"greedy"}
				disableDefaultUI={true}
				reuseMaps
			/>
		</APIProvider>
	);
}
