import { Image } from "~/components/ui/image";
import { useTranslation } from "react-i18next";
import { Card } from "~/components/ui/card";
import { useMessageStore, type Message } from "~/stores/message-store";
import { cn } from "~/lib/utils";
import { View, Linking, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import type { Profile } from "~/models/profile";
import * as ContextMenu from "zeego/context-menu";
import * as Clipboard from "expo-clipboard";
import { toast } from "sonner-native";
import { firebase } from "@react-native-firebase/firestore";

export interface TextMessageProps {
	message: Message;
	userId: string;
	senderProfile: Profile;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;
const GOOGLEMAP_REGEX =
	/https:\/\/www\.google\.com\/maps\/@(-?\d+\.\d+),(-?\d+\.\d+)/;

const TextMessage = ({ message, userId, senderProfile }: TextMessageProps) => {
	const { t } = useTranslation();
	const { chatId } = useMessageStore();

	const renderContent = (content: string) => {
		return content.split(URL_REGEX).map((part, index) => {
			if (index % 2 === 1) {
				return (
					<Text
						key={`url-${index.toString()}`}
						onPress={() => Linking.openURL(part)}
						className="text-blue-700 dark:text-blue-400 underline"
					>
						{part}
					</Text>
				);
			}
			return (
				<Text className="text-lg" key={`text-${index.toString()}`}>
					{part}
				</Text>
			);
		});
	};

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<ContextMenu.Root>
				<ContextMenu.Trigger>
					<Card
						className={cn(
							"p-3 max-w-[80vw]",
							message.sender === userId ? "bg-card" : "bg-muted",
						)}
					>
						<View className="flex flex-col gap-1">
							<Text className="font-semibold text-lg">
								{senderProfile.name}
							</Text>
							<Text className="text-xl">{renderContent(message.content)}</Text>
							{message.updatedAt && (
								<Text className="text-xs text-muted-foreground">
									{t("chats.edited")}
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
						<ContextMenu.ItemTitle>{t("chats.copy")}</ContextMenu.ItemTitle>
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
						<ContextMenu.Item
							key="delete"
							destructive
							onSelect={() => {
								Alert.alert(t("chats.delete"), t("chats.delete_message"), [
									{
										text: t("chats.cancel"),
										style: "cancel",
									},
									{
										text: t("chats.delete"),
										style: "destructive",
										onPress: async () => {
											// delete the message
											await firebase
												.firestore()
												.collection(`chats/${chatId}/messages`)
												.doc(message.id)
												.delete();

											toast.success(t("chats.message_deleted"));
										},
									},
								]);
							}}
						>
							<ContextMenu.ItemTitle>{t("chats.delete")}</ContextMenu.ItemTitle>
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
				className="h-12 w-12 rounded-full object-cover mb-2"
			/>
		</View>
	);
};

export default TextMessage;
