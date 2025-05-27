import {
	ActivityIndicator,
	View,
	TouchableOpacity,
	type LayoutChangeEvent,
	Dimensions,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import type { TextMessageProps } from "./TextMessage";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Image } from "~/components/ui/image";
import { AudioModule, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Button } from "~/components/ui/button";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "~/components/ui/text";
import { Progress } from "~/components/ui/progress";
import * as ContextMenu from "zeego/context-menu";
import Slider from "@react-native-community/slider";
import { useTranslation } from "react-i18next";

export default function AudioMessage({
	message,
	userId,
	senderProfile,
	onDelete,
}: TextMessageProps & { onDelete?: () => void }) {
	const { t } = useTranslation();

	const player = useAudioPlayer({
		uri: message.content,
	});

	const playerStatus = useAudioPlayerStatus(player);
	const [progressBarWidth, setProgressBarWidth] = useState(0);

	const { isDarkColorScheme } = useColorScheme();
	const iconColor = isDarkColorScheme ? "#fff" : "#000";

	// Format time in MM:SS format
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
	};

	// Calculate progress percentage
	const progressPercentage =
		playerStatus.isLoaded && playerStatus.duration > 0
			? (playerStatus.currentTime / playerStatus.duration) * 100
			: 0;

	// Handle seeking when tapping on the progress bar
	const handleSeek = async (event: any) => {
		if (!playerStatus.isLoaded || playerStatus.duration <= 0) return;

		try {
			// Calculate the seek position
			const touchX = event.nativeEvent.locationX;
			const percentage = (touchX / progressBarWidth) * 100;
			const clampedPercentage = Math.max(0, Math.min(percentage, 100));
			const seekTime = (clampedPercentage / 100) * playerStatus.duration;

			console.log(
				`Seeking to ${seekTime.toFixed(2)}s (${clampedPercentage.toFixed(1)}%)`,
			);

			// Perform the seek operation
			await player.seekTo(seekTime);

			// If not playing, start playback
			if (!playerStatus.playing) {
				await player.play();
			}
		} catch (error) {
			console.error("Error during seek operation:", error);
		}
	};

	// Measure the progress bar width for accurate seeking
	const onProgressBarLayout = (event: LayoutChangeEvent) => {
		const { width } = event.nativeEvent.layout;
		setProgressBarWidth(width);
	};

	async function playPause() {
		AudioModule.setAudioModeAsync({
			interruptionMode: "duckOthers",
			playsInSilentMode: true,
			shouldPlayInBackground: true,
			shouldRouteThroughEarpiece: false,
			allowsRecording: false,
		});

		try {
			if (playerStatus.didJustFinish) {
				await player.seekTo(0);
				await player.play();
			} else if (playerStatus.playing) {
				await player.pause();
			} else {
				await player.play();
			}
		} catch (error) {
			console.error("Error toggling playback:", error);
		}
	}

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<Card
						className={cn(
							"flex w-[65vw] flex-row gap-4 items-center p-3 overflow-hidden ",
							message.sender === userId ? "bg-card" : "bg-muted",
						)}
					>
						<Button
							onPress={() => playPause()}
							className="p-2"
							size={"icon"}
							variant={"outline"}
							disabled={!playerStatus.isLoaded}
						>
							{playerStatus.playing && !playerStatus.didJustFinish ? (
								<IconPlayerPause color={iconColor} />
							) : (
								<IconPlayerPlay color={iconColor} />
							)}
						</Button>

						<View className="flex-1">
							<TouchableOpacity
								activeOpacity={0.7}
								onLayout={onProgressBarLayout}
								onPress={handleSeek}
							>
								<Slider
									value={progressPercentage}
									maximumValue={100}
									onSlidingComplete={(value) => {
										const seekTime = (value / 100) * playerStatus.duration;
										player.seekTo(seekTime);
									}}
									onSlidingStart={() => player.pause()}
									minimumTrackTintColor={
										isDarkColorScheme ? "#ffffff" : "#000000"
									} // Pure black/white
									maximumTrackTintColor={
										isDarkColorScheme ? "#333333" : "#dddddd"
									} // Dark/light gray background
									thumbTintColor={isDarkColorScheme ? "#cccccc" : "#555555"} // Medium gray thumb
									style={{ width: "100%", height: 40 }}
								/>
							</TouchableOpacity>
							<Text className="text-xs mt-1 text-muted-foreground">
								{formatTime(playerStatus.currentTime)} /{" "}
								{formatTime(playerStatus.duration)}
							</Text>
						</View>
					</Card>
				</ContextMenu.Trigger>

				<ContextMenu.Content>
					{playerStatus.playing && (
						<ContextMenu.Item key="pause" onSelect={() => playPause()}>
							<ContextMenu.ItemTitle>{t("audio.pause")}</ContextMenu.ItemTitle>
							<ContextMenu.ItemIcon
								ios={{
									name: "pause.fill",
									pointSize: 10,
									weight: "semibold",
									scale: "large",
								}}
								androidIconName="pause"
							/>
						</ContextMenu.Item>
					)}
					{!playerStatus.didJustFinish && !playerStatus.playing && (
						<ContextMenu.Item key="play" onSelect={() => playPause()}>
							<ContextMenu.ItemTitle>{t("audio.play")}</ContextMenu.ItemTitle>
							<ContextMenu.ItemIcon
								ios={{
									name: "play.fill",
									pointSize: 10,
									weight: "semibold",
									scale: "large",
								}}
								androidIconName="play_arrow"
							/>
						</ContextMenu.Item>
					)}

					<ContextMenu.Item
						key="restart"
						onSelect={() => {
							player.seekTo(0);
							player.play();
						}}
					>
						<ContextMenu.ItemTitle>{t("audio.restart")}</ContextMenu.ItemTitle>
						<ContextMenu.ItemIcon
							ios={{
								name: "arrow.counterclockwise",
								pointSize: 10,
								weight: "semibold",
								scale: "large",
							}}
							androidIconName="refresh"
						/>
					</ContextMenu.Item>
					{message.sender === userId && (
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
