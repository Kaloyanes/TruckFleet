import {
	ActivityIndicator,
	View,
	TouchableOpacity,
	type LayoutChangeEvent,
} from "react-native";
import React, { useState, useRef } from "react";
import type { TextMessageProps } from "./TextMessage";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Image } from "~/components/ui/image";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { Button } from "~/components/ui/button";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { Text } from "~/components/ui/text";
import { Progress } from "~/components/ui/progress";
import * as ContextMenu from "zeego/context-menu";

export default function AudioMessage({
	message,
	userId,
	senderProfile,
}: TextMessageProps) {
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

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<Card
				className={cn(
					"flex flex-row gap-4 items-center p-3 max-w-[65vw] overflow-hidden ",
					message.sender === userId ? "bg-card" : "bg-muted",
				)}
			>
				<Button
					onPress={async () => {
						try {
							if (playerStatus.didJustFinish || playerStatus.playing) {
								await player.pause();
							} else {
								await player.play();
							}
						} catch (error) {
							console.error("Error toggling playback:", error);
						}
					}}
					className="p-2"
					size={"icon"}
					variant={"outline"}
					disabled={!playerStatus.isLoaded}
				>
					{playerStatus.playing || playerStatus.didJustFinish ? (
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
						<Progress
							value={progressPercentage}
							max={100}
							className="w-full h-4"
						/>
					</TouchableOpacity>
					{playerStatus.isLoaded && (
						<Text className="text-xs mt-1 text-muted-foreground">
							{formatTime(playerStatus.currentTime)} /{" "}
							{formatTime(playerStatus.duration)}
						</Text>
					)}
				</View>
			</Card>

			<Image
				source={senderProfile.photoUrl}
				alt={senderProfile.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</View>
	);
}
