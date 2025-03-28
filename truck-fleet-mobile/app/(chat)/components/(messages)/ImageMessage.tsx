import { Alert, View } from "react-native";
import React from "react";

import { Image } from "~/components/ui/image";
import type { TextMessageProps } from "./TextMessage";
import { Galeria } from "@nandorojo/galeria";
import * as ContextMenu from "zeego/context-menu";
import { toast } from "sonner-native";
import { firebase } from "@react-native-firebase/firestore";
import { useMessageStore } from "~/stores/message-store";
import { useTranslation } from "react-i18next";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

export default function ImageMessage({
	message,
	userId,
	senderProfile,
}: TextMessageProps) {
	const url = message.content;
	const chatId = useMessageStore((state) => state.chatId);
	const { t } = useTranslation();
	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<ContextMenu.Root
				onOpenChange={() => {
					impactAsync(ImpactFeedbackStyle.Light);
				}}
			>
				<ContextMenu.Trigger asChild>
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
				</ContextMenu.Trigger>
				<ContextMenu.Content>
					{userId === message.sender && (
						<ContextMenu.Item
							key={`delete-${message.id}`}
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
									name: "trash", // required
									pointSize: 10,
									weight: "semibold",
									scale: "large",
								}}
								androidIconName="delete"
							/>
						</ContextMenu.Item>
					)}

					<ContextMenu.Item
						key="download-image"
						onSelect={() => {
							console.log("Download image");
						}}
					>
						<ContextMenu.ItemTitle>{t("file.download")}</ContextMenu.ItemTitle>
						<ContextMenu.ItemIcon
							ios={{
								name: "arrow.down.circle",
								pointSize: 10,
								weight: "semibold",
								scale: "large",
							}}
							androidIconName="download"
						/>
					</ContextMenu.Item>
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
