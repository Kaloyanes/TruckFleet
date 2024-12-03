"use client";;
import { use } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";

export default function MapLayout(props: { params: Promise<{ locale: string }>; children: React.ReactNode }) {
    const params = use(props.params);

    const {
        locale
    } = params;

    const {
        children
    } = props;

    return (
		<APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
			{children}
		</APIProvider>
	);
}
