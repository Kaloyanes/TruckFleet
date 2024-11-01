"use client";

import Image from "next/image";
import type { Message } from "@/models/message";
import {
	Map as GoogleMap,
	Marker,
	RenderingType,
} from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";

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
					zoom={15}
					center={location}
					mapId={mapId}
					disableDefaultUI={true}
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
		<div className={"flex flex-row-reverse items-end justify-end gap-2"}>
			<div className="flex flex-col">
				<div
					className={`relative flex min-h-13 w-fit min-w-64 max-w-[30vw] flex-col items-start rounded-3xl rounded-bl-md bg-accent px-4 py-3 ${
						message.sender === userId ? " bg-sidebar-border" : "bg-secondary"
					}`}
				>
					<h1 className="font-semibold">{senderProfile.name}</h1>

					{renderMap()}
					<div className="pt-2 text-xs text-gray-400">
						{location?.lat?.toFixed(2)}, {location?.lng?.toFixed(2)}
					</div>
				</div>
			</div>
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
