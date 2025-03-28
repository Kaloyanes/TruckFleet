import { useWindowDimensions, View, Alert } from "react-native";
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
import type { TextMessageProps } from "./TextMessage";
import { setStatusBarHidden, StatusBar } from "expo-status-bar";
import * as ContextMenu from "zeego/context-menu";
import { useMessageStore } from "~/stores/message-store";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

cssInterop(VideoView, { className: "style" });

export default function VideoMessage({
	message,
	userId,
	senderProfile,
}: TextMessageProps) {
	const { t } = useTranslation();
	const player = useVideoPlayer(message.content, (player) => {
		player.loop = true;
		player.staysActiveInBackground = true;
		player.showNowPlayingNotification = true;
	});

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<ContextMenu.Root
				onOpenChange={() => {
					impactAsync(ImpactFeedbackStyle.Light);
				}}
			>
				<ContextMenu.Trigger>
					<VideoView
						className="w-[50vw] h-[50vh] rounded-2xl overflow-hidden"
						player={player}
						allowsPictureInPicture
						allowsFullscreen
						contentFit="cover"
						onFullscreenEnter={() => {
							setStatusBarHidden(true, "fade");
						}}
						onFullscreenExit={() => {
							setStatusBarHidden(false, "fade");
						}}
					/>
				</ContextMenu.Trigger>
				<ContextMenu.Content>
					{userId === message.sender && (
						<ContextMenu.Item
							key="delete"
							destructive
							onSelect={() => {
								Alert.alert(
									t("chats.deleteMessageQuestion"),
									t("chats.delete_message"),
									[
										{
											text: t("chats.cancel"),
											style: "cancel",
										},
										{
											text: t("chats.delete"),
											style: "destructive",
											onPress: async () => {
												await useMessageStore.getState().deleteMessage(message);
											},
										},
									],
								);
							}}
						>
							<ContextMenu.ItemTitle>{t("chats.delete")}</ContextMenu.ItemTitle>
							<ContextMenu.ItemIcon
								ios={{
									name: "trash",
									pointSize: 10,
									weight: "semibold",
									scale: "large",
								}}
								androidIconName="delete"
							/>
						</ContextMenu.Item>
					)}
				</ContextMenu.Content>
			</ContextMenu.Root>

			<Image
				source={senderProfile.photoUrl}
				alt={senderProfile.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</View>
	);
}
