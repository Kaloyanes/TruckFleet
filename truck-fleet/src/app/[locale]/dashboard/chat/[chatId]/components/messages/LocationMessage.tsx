"use client";

import Image from "next/image";
import type { Message } from "@/types/message";
import {
	Map as GoogleMap,
	Marker,
	RenderingType,
} from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/Utils";

interface LocationMessageProps {
	message: Message;
	userId: string;
	senderProfile: { name: string; photoUrl: string };
	showMessageStyling?: boolean;
}

const LocationMessage = ({
	message,
	userId,
	senderProfile,
	showMessageStyling = true,
}: LocationMessageProps) => {
	const { resolvedTheme } = useTheme();
	const mapId =
		resolvedTheme === "dark" ? "71b489216afed105" : "41fca17a46fdb39e";
	const location = JSON.parse(message.content);

	if (!location?.lat || !location?.lng) return null;

	const renderMap = () => {
		return (
			<div className="mt-2 h-[250px] w-full min-w-[400px] overflow-hidden rounded-lg">
				<GoogleMap
					zoom={14}
					center={location}
					mapId={mapId}
					disableDefaultUI={true}
					keyboardShortcuts={false}
					gestureHandling="none"
					style={{ width: "100%", height: "100%" }}
					onClick={() => {
						window.open(
							`https://www.google.com/maps?q=${location.lat},${location.lng}`,
							"_blank",
						);
					}}
					renderingType={RenderingType.VECTOR}
				>
					<Marker
						position={location}
						onClick={() => {
							window.open(
								`https://www.google.com/maps?q=${location.lat},${location.lng}`,
								"_blank",
							);
						}}
					/>
				</GoogleMap>
			</div>
		);
	};

	if (!showMessageStyling) {
		return renderMap();
	}

	return (
		<div className="flex flex-row-reverse items-end justify-end gap-2">
			<Card
				className={cn(
					"p-3",
					message.sender === userId ? "bg-sidebar-accent" : "bg-muted",
				)}
			>
				<div className="flex flex-col gap-2">
					<h1 className="font-semibold">{senderProfile.name}</h1>
					{renderMap()}
					<div className="text-xs text-muted-foreground">
						{location?.lat?.toFixed(2)}, {location?.lng?.toFixed(2)}
					</div>
				</div>
			</Card>
			<Image
				src={senderProfile.photoUrl}
				width={40 * 2}
				height={40 * 2}
				alt={senderProfile.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</div>
	);
};

export default LocationMessage;
