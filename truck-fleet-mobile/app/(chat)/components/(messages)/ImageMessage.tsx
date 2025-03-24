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
			<ContextMenu.Root>
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
												// delete the message
												await firebase
													.firestore()
													.collection(`chats/${chatId}/messages`)
													.doc(message.id)
													.delete();

												toast.success(t("chats.message_deleted"));
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
								androidIconName="progress_horizontal"
							/>
						</ContextMenu.Item>
					)}

					<ContextMenu.Item
						key="download-image"
						onSelect={() => {
							console.log("Download image");
						}}
					>
						Download
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
