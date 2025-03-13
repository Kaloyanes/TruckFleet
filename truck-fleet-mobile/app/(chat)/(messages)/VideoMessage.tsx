import { useWindowDimensions, View } from "react-native";
import React, { useEffect } from "react";
import type { Message } from "~/stores/message-store";
import type { Profile } from "~/models/profile";
import { Text } from "~/components/ui/text";
import { useVideoPlayer, VideoView } from "expo-video";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { useTranslation } from "react-i18next";
import { Image } from "~/components/ui/image";
import { cssInterop } from "nativewind";

cssInterop(VideoView, { className: "style" });

interface TextMessageProps {
	message: Message;
	userId: string;
	senderProfile: Profile;
}

export default function VideoMessage({
	message,
	userId,
	senderProfile,
}: TextMessageProps) {
	const player = useVideoPlayer(message.content, (player) => {
		player.loop = true;
		player.staysActiveInBackground = true;
		player.showNowPlayingNotification = true;
	});

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<VideoView
				className="w-[50vw] h-[50vh] rounded-2xl overflow-hidden"
				player={player}
				allowsPictureInPicture
				allowsFullscreen
				contentFit="cover"
				startsPictureInPictureAutomatically
			/>

			<Image
				source={senderProfile.photoUrl}
				alt={senderProfile.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</View>
	);
}
