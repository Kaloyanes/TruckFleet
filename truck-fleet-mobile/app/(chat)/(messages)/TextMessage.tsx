import { Image } from "~/components/ui/image";
import { useTranslation } from "react-i18next";
import { Card } from "~/components/ui/card";
import type { Message } from "~/stores/message-store";
import { cn } from "~/lib/utils";
import { View, Linking, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import type { Profile } from "~/models/profile";
import * as ContextMenu from "zeego/context-menu";
import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";

interface TextMessageProps {
	message: Message;
	userId: string;
	senderProfile: Profile;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const GOOGLEMAP_REGEX =
	/https:\/\/www\.google\.com\/maps\/@(-?\d+\.\d+),(-?\d+\.\d+)/;

const TextMessage = ({ message, userId, senderProfile }: TextMessageProps) => {
	const { t } = useTranslation();

	const renderContent = (content: string) => {
		return content.split(URL_REGEX).map((part, index) => {
			if (index % 2 === 1) {
				return (
					<Text
						key={`url-${index}`}
						onPress={() => Linking.openURL(part)}
						className="text-blue-700 dark:text-blue-400 underline"
					>
						{part}
					</Text>
				);
			}
			return <Text key={`text-${index}`}>{part}</Text>;
		});
	};

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2 ">
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<Card
						className={cn(
							"p-3 max-w-[80vw]",
							message.sender === userId ? "bg-sidebar-accent" : "bg-muted",
						)}
					>
						<View className="flex flex-col gap-1">
							<Text className="font-semibold text-xl">
								{senderProfile.name}
							</Text>
							<Text className="text-xl">{renderContent(message.content)}</Text>
							{message.updatedAt && (
								<Text className="text-xs text-muted-foreground">
									{t("edited")}
								</Text>
							)}
						</View>
					</Card>
				</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item
						onSelect={async () => {
							await Clipboard.setStringAsync(message.content.trim());
							toast.success(t("copied_to_clipboard"));
						}}
						key="copy"
					>
						<ContextMenu.ItemTitle>{t("copy")}</ContextMenu.ItemTitle>
						<ContextMenu.ItemIcon
							ios={{
								name: "clipboard.fill", // required
								pointSize: 10,
								weight: "semibold",
								scale: "large",
							}}
							androidIconName="progress_horizontal"
						/>
					</ContextMenu.Item>
					{userId === message.sender && (
						<ContextMenu.Item key="delete" destructive>
							<ContextMenu.ItemTitle>{t("delete")}</ContextMenu.ItemTitle>
							<ContextMenu.ItemIcon
								ios={{
									name: "trash", // required
									pointSize: 10,
									weight: "semibold",
									scale: "large",
								}}
								androidIconName="progress_horizontal"
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
};

export default TextMessage;
