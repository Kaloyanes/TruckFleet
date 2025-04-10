import { View, Dimensions, Alert } from "react-native";
import React from "react";
import MapView, { Marker } from "react-native-maps";
import { Image } from "~/components/ui/image";
import { type Message, useMessageStore } from "~/stores/message-store";
import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import type { TextMessageProps } from "./TextMessage";
import * as ContextMenu from "zeego/context-menu";
import * as Linking from "expo-linking";
import { useTranslation } from "react-i18next";
import { Pressable } from "react-native-gesture-handler";
import { showLocation } from "react-native-map-link";
import { trigger } from "react-native-haptic-feedback";

export default function LocationMessage({
	message,
	senderProfile,
	userId,
}: TextMessageProps) {
	const { t } = useTranslation();
	const locationData = message.content ? JSON.parse(message.content) : null;
	const screenWidth = Dimensions.get("window").width;
	const mapWidth = screenWidth * 0.6 > 300 ? 300 : screenWidth * 0.6;

	if (!locationData || !locationData.lat || !locationData.lng) {
		return (
			<View className="p-3 bg-red-500/20 rounded-lg">
				<Text className="text-white">Invalid location data</Text>
			</View>
		);
	}

	const { lat, lng, title = "Shared Location" } = locationData;

	const openInMaps = async () => {
		await showLocation({
			latitude: lat,
			longitude: lng,
			title,
			directionsMode: "car",
			cancelText: t("chats.cancel"),
			dialogTitle: t("chats.open_in_maps"),
			dialogMessage: t("chats.open_in_maps_message"),
			alwaysIncludeGoogle: true,
			appsWhiteList: ["apple-maps", "google-maps", "waze", "truckmap"],
		});
	};

	return (
		<View className="flex flex-row-reverse items-end justify-end gap-2">
			<ContextMenu.Root
				onOpenChange={() => {
					trigger("impactLight");
				}}
			>
				<ContextMenu.Trigger>
					<Pressable onPress={openInMaps}>
						<Card
							className={cn(
								"p-3 overflow-hidden",
								message.sender === userId ? "bg-card" : "bg-muted",
							)}
						>
							<View className="flex flex-col gap-1">
								<Text className="font-semibold text-lg">
									{senderProfile.name}
								</Text>
								<View
									className="rounded-lg overflow-hidden h-[200px]"
									style={{ width: mapWidth }}
								>
									<MapView
										style={{
											width: "100%",
											height: "100%",
										}}
										initialRegion={{
											latitude: lat,
											longitude: lng,
											latitudeDelta: 0.01,
											longitudeDelta: 0.01,
										}}
										scrollEnabled={false}
										zoomEnabled={false}
										rotateEnabled={false}
										pitchEnabled={false}
									>
										<Marker
											coordinate={{ latitude: lat, longitude: lng }}
											title={title}
											titleVisibility="hidden"
										/>
									</MapView>
								</View>
							</View>
						</Card>
					</Pressable>
				</ContextMenu.Trigger>
				<ContextMenu.Content>
					<ContextMenu.Item key="open" onSelect={openInMaps}>
						<ContextMenu.ItemTitle>
							{t("chats.open_in_maps")}
						</ContextMenu.ItemTitle>
						<ContextMenu.ItemIcon
							ios={{
								name: "map.fill",
								pointSize: 10,
								weight: "semibold",
								scale: "large",
							}}
							androidIconName="map"
						/>
					</ContextMenu.Item>
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
				className="h-12 w-12 rounded-full object-cover mb-2"
			/>
		</View>
	);
}
