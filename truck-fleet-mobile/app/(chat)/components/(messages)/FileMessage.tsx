import * as ContextMenu from "zeego/context-menu";
import { useWindowDimensions, View } from "react-native";
import React, { useEffect } from "react";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import type { TextMessageProps } from "./TextMessage";
import { cn } from "~/lib/utils";
import { IconDownload, IconFile } from "@tabler/icons-react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { Button } from "~/components/ui/button";
import { Image } from "~/components/ui/image";
import * as FileSystem from "expo-file-system";
import { toast } from "sonner-native";
import { MotiView } from "moti";
import {
	interpolate,
	useDerivedValue,
	useSharedValue,
} from "react-native-reanimated";
import type { Message } from "~/stores/message-store";
import type { Profile } from "~/models/profile";

export default function FileMessage({
	message,
	userId,
	senderProfile,
	fileName,
}: {
	message: Message;
	userId: string;
	senderProfile: Profile;
	fileName: string;
}) {
	const { isDarkColorScheme } = useColorScheme();
	const [isDownloading, setIsDownloading] = React.useState(false);
	const progress = useSharedValue(0);
	const { width } = useWindowDimensions();

	useEffect(() => {
		console.log({ ...message });
	}, [message]);

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
			{message.fileName && (
				<ContextMenu.Root>
					<ContextMenu.Trigger asChild>
						<Card
							className={cn(
								"p-3 max-w-[65vw]",
								message.sender === userId ? "bg-card" : "bg-muted",
							)}
						>
							<View className="flex flex-row gap-4 items-center">
								<View className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5">
									<IconFile color={isDarkColorScheme ? "#fff" : "#000"} />
								</View>

								<View className="flex flex-1 flex-col overflow-hidden w-full h-auto">
									<Text className="truncate text-sm font-medium w-full">
										{message.fileName || "File"}
									</Text>
									<Text className="text-xs text-muted-foreground">
										{message.fileType || "Unknown"}
									</Text>
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
							</View>

							{__DEV__ && !message.fileName && (
								<Text className="text-xs text-red-500 mt-1">
									Missing filename
								</Text>
							)}

							<MotiView
								animate={useDerivedValue(() => ({
									opacity: isDownloading ? 1 : 0,
									width: interpolate(progress.value, [0, 1], [0, width * 0.65]),
								}))}
								className="absolute inset-0 bg-primary/10"
							/>
						</Card>
					</ContextMenu.Trigger>
					<ContextMenu.Content>
						<ContextMenu.Item key="download" onSelect={handleDownload}>
							Download
						</ContextMenu.Item>
					</ContextMenu.Content>
				</ContextMenu.Root>
			)}

			<Image
				source={senderProfile.photoUrl}
				alt={senderProfile.name}
				className="h-12 w-12 rounded-full object-cover"
			/>
		</View>
	);
}
