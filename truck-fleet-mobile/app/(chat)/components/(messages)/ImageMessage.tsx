import { View } from "react-native";
import React from "react";

import { Image } from "~/components/ui/image";
import type { TextMessageProps } from "./TextMessage";
import { Galeria } from "@nandorojo/galeria";

export default function ImageMessage({
	message,
	userId,
	senderProfile,
}: TextMessageProps) {
	const url = message.content;

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<Galeria urls={[url]} closeIconName="xmark">
				<Galeria.Image>
					<Image
						source={url}
						className="rounded-2xl overflow-hidden"
						style={{
							width: 200,
							height: 430,
						}}
					/>
				</Galeria.Image>
			</Galeria>

			<Image
				source={senderProfile.photoUrl}
				alt={senderProfile.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</View>
	);
}
