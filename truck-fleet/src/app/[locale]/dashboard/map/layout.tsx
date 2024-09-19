"use client";
import { APIProvider } from "@vis.gl/react-google-maps";
import { unstable_setRequestLocale } from "next-intl/server";

export default function MapLayout({
	children,
	params: { locale },
}: {
	params: { locale: string };
	children: React.ReactNode;
}) {
	// unstable_setRequestLocale(locale);

	return (
		<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
			{children}
		</APIProvider>
	);
}
