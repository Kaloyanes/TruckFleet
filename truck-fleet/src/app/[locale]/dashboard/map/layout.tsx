"use client";
import { use } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { setRequestLocale } from "next-intl/server";

export default function MapLayout({
	params: { locale },
	children,
}: { params: { locale: string }; children: React.ReactNode }) {
	setRequestLocale(locale);

	return (
		<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
			{children}
		</APIProvider>
	);
}
