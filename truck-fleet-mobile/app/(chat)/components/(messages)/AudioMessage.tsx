import { View } from "react-native";
import React, { useEffect } from "react";
import type { TextMessageProps } from "./TextMessage";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Image } from "~/components/ui/image";
import { useAudioPlayer } from "expo-audio";
import { Button } from "~/components/ui/button";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "~/components/ui/text";

export default function AudioMessage({
	message,
	userId,
	senderProfile,
}: TextMessageProps) {
	const player = useAudioPlayer({
		uri: message.content,
	});
	const { isDarkColorScheme } = useColorScheme();
	const iconColor = isDarkColorScheme ? "#fff" : "#000";

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<Card
				className={cn(
					"flex flex-row gap-4 items-center p-3 max-w-[65vw] overflow-hidden ",
					message.sender === userId ? "bg-card" : "bg-muted",
				)}
			>
				<Text>{player.duration.toFixed()}</Text>

				<Button
					onPress={() => player.play()}
					className="p-2"
					size={"icon"}
					variant={"outline"}
					disabled={!player.isLoaded}
				>
					{player.playing ? (
						<IconPlayerPause color={iconColor} />
					) : (
						<IconPlayerPlay color={iconColor} />
					)}
				</Button>
			</Card>

			<Image
				source={senderProfile.photoUrl}
				alt={senderProfile.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</View>
	);
}
