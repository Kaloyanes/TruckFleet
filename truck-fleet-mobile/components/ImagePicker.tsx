import {
	FlatList,
	Platform,
	Pressable,
	useWindowDimensions,
	View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import {
	IconAlbum,
	IconCamera,
	IconCheck,
	IconPhoto,
} from "@tabler/icons-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRegisterStore } from "~/stores/register-store";
import { useColorScheme } from "~/lib/useColorScheme";
import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import type { ImagePickerAsset } from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { MasonryFlashList } from "@shopify/flash-list";
import { Image } from "~/components/ui/image";
import { Button } from "./ui/button";
import { useHeaderHeight } from "@react-navigation/elements";
import { cn } from "~/lib/utils";
import * as ContextMenu from "zeego/context-menu";
import { trigger } from "react-native-haptic-feedback";

export default function ImagePickerComponent({
	onImageSelected,
}: {
	onImageSelected: (asset: ImagePickerAsset) => void;
}) {
	const { t } = useTranslation();
	const [photos, setPhotos] =
		useState<MediaLibrary.PagedInfo<MediaLibrary.Asset> | null>(null);

	const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (permissionResponse?.status !== "granted") {
			requestPermission();
		}
	}, []);

	useEffect(() => {
		if (permissionResponse?.status === "granted")
			(async () => {
				const photos = await MediaLibrary.getAssetsAsync({
					first: 100,
				});
				setPhotos(photos);
			})();
	}, [permissionResponse]);

	async function TakePhoto() {
		trigger("impactLight");

		const { status } = await ImagePicker.requestCameraPermissionsAsync();
		if (status !== "granted") {
			alert(t("camera_permission_error"));
			return;
		}
		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: "images",
			allowsEditing: true,
			quality: 0.5,
			cameraType: ImagePicker.CameraType.front,
		});
		if (!result.canceled) {
			onImageSelected(result.assets[0]);
			router.back();
			// updateValidPage(3, true);
		}
	}

	async function PickFromGallery() {
		trigger("impactLight");

		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== "granted") {
			alert(t("camera_permission_error"));
			return;
		}
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "images",
			allowsEditing: true,
			quality: 0.5,
		});
		if (!result.canceled) {
			onImageSelected(result.assets[0]);
			router.back();
		}
	}

	const { isDarkColorScheme } = useColorScheme();

	const iconColor = isDarkColorScheme ? "#fff" : "#71717a";

	const { width } = useWindowDimensions();

	return (
		<>
			<Stack.Screen
				options={{
					headerRight: (props) => {
						return (
							<Button variant="ghost" size="icon" onPress={PickFromGallery}>
								<IconAlbum size={24} color={iconColor} />
							</Button>
						);
					},
				}}
			/>
			<View className="flex-1 w-full flex-col h-screen android:h-[80vh]">
				{Platform.OS === "android" && (
					<View className="w-full items-center">
						<View className="w-12 h-1 bg-gray-400 rounded-full my-2" />
					</View>
				)}

				<FlatList
					data={[
						{ id: "camera", isCamera: true } as const,
						...(photos?.assets || []),
					]}
					className="flex-1"
					contentInsetAdjustmentBehavior="automatic"
					onEndReachedThreshold={1}
					numColumns={3}
					contentContainerClassName="gap-1 px-1"
					columnWrapperClassName="gap-1"
					ListFooterComponent={
						photos?.hasNextPage ? <View className="h-10 pb-safe" /> : null
					}
					renderItem={({ item, index }) => {
						if ("isCamera" in item) {
							return (
								<Pressable
									onPress={TakePhoto}
									className="aspect-square rounded-lg bg-secondary/75 items-center justify-center rounded-tl-2xl"
									style={{
										width: (width - 8) / 3, // 4px gaps * 2 (between items)
									}}
								>
									<IconCamera size={42} color={iconColor} />
								</Pressable>
							);
						}

						return (
							<ContextMenu.Root>
								<ContextMenu.Trigger>
									<Pressable
										onPress={() => onImageSelected(item)}
										className={cn(
											"aspect-square rounded-lg overflow-hidden",
											index === 2 && "rounded-tr-2xl",
										)}
										style={{
											width: (width - 8) / 3,
										}}
									>
										<Image
											source={{ uri: item.uri }}
											style={{
												width: "100%",
												height: "100%",
											}}
											className="aspect-square"
											contentFit="cover"
											recyclingKey={item.id}
											cachePolicy="memory"
										/>
									</Pressable>
								</ContextMenu.Trigger>
								<ContextMenu.Preview>
									<Image
										source={{ uri: item.uri }}
										style={{
											width: width * 0.8,
											// aspectRatio: 1,
											// height: width * 0.8,
										}}
										className="rounded-lg "
									/>
								</ContextMenu.Preview>
								<ContextMenu.Content>
									<ContextMenu.Item
										onSelect={() => onImageSelected(item)}
										key="select"
									>
										<ContextMenu.ItemIcon>
											<IconCheck size={24} color={iconColor} />
										</ContextMenu.ItemIcon>
										<ContextMenu.ItemTitle>{t("select")}</ContextMenu.ItemTitle>
									</ContextMenu.Item>
								</ContextMenu.Content>
							</ContextMenu.Root>
						);
					}}
					keyExtractor={(item) => item.id}
				/>
			</View>
		</>
	);
}
