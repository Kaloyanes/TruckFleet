import { useWindowDimensions, View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import type { TextMessageProps } from "./TextMessage";
import { cn } from "~/lib/utils";
import { IconDownload, IconFile } from "@tabler/icons-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "~/components/ui/button";
import { Image } from "~/components/ui/image";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { toast } from "sonner-native";
import { MotiView } from "moti";
import {
	interpolate,
	useDerivedValue,
	useSharedValue,
} from "react-native-reanimated";

export default function FileMessage({
	message,
	userId,
	senderProfile,
}: TextMessageProps) {
	const { isDarkColorScheme } = useColorScheme();
	const [isDownloading, setIsDownloading] = React.useState(false);
	const progress = useSharedValue(0);
	const { width } = useWindowDimensions();

	const handleDownload = async () => {
		setIsDownloading(true);
		const downloadResumable = FileSystem.createDownloadResumable(
			message.content,
			`${FileSystem.documentDirectory}${message.fileName}`,
			{},
			(props) => {
				progress.value =
					props.totalBytesWritten / props.totalBytesExpectedToWrite;
			},
		);

		await downloadResumable.downloadAsync().catch((error) => {
			console.log(error);
			toast.error("Failed to download");
		});

		setIsDownloading(false);
		toast.success("Downloaded successfully");
	};

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<Card
				className={cn(
					"flex flex-row gap-4 items-center p-3 max-w-[65vw] relative overflow-hidden ",
					message.sender === userId ? "bg-card" : "bg-muted",
				)}
			>
				<View className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
					<IconFile color={isDarkColorScheme ? "#fff" : "#000"} />
				</View>

				<View className="flex flex-1 flex-col overflow-hidden">
					<Text className="truncate text-sm font-medium">
						{message.fileName || "File"}
					</Text>
					{message.fileType && (
						<Text className="text-xs text-muted-foreground">
							{message.fileType}
						</Text>
					)}
				</View>

				<Button
					variant="ghost"
					size="icon"
					className="shrink-0"
					onPress={handleDownload}
					disabled={isDownloading}
				>
					<IconDownload color={isDarkColorScheme ? "#fff" : "#000"} />
				</Button>

				<MotiView
					animate={useDerivedValue(() => ({
						opacity: isDownloading ? 1 : 0,
						width: interpolate(progress.value, [0, 1], [0, width * 0.65]),
					}))}
					className="absolute inset-0 bg-primary/10 "
				/>
			</Card>

			<Image
				source={senderProfile.photoUrl}
				alt={senderProfile.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</View>
	);
}
