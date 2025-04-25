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
	IconSend,
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
import { AnimatePresence, MotiView } from "moti";
import { Easing, LinearTransition } from "react-native-reanimated";

export default function ImagePickerComponent({
	onImageSelected = () => {},
	onImagesSelected = () => {},
	allowsEditing = false,
	allowsMultipleSelection = false,
}: {
	onImageSelected?: (asset: ImagePickerAsset) => void;
	onImagesSelected?: (assets: ImagePickerAsset[]) => void;
	allowsEditing?: boolean;
	allowsMultipleSelection?: boolean;
}) {
	const { t } = useTranslation();
	const [photos, setPhotos] =
		useState<MediaLibrary.PagedInfo<MediaLibrary.Asset> | null>(null);

	const [selectedPhotos, setSelectedPhotos] = useState<ImagePickerAsset[]>([]);

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
		trigger("impactMedium");

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
		}
	}

	async function PickFromGallery() {
		trigger("impactMedium");

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
							<View className="flex-row gap-2">
								<MotiView
									layout={LinearTransition.easing(
										Easing.out(Easing.poly(4)),
									).duration(250)}
									className="w-10"
								>
									<Button variant="ghost" size="icon" onPress={PickFromGallery}>
										<IconAlbum size={24} color={iconColor} />
									</Button>
								</MotiView>
								<AnimatePresence>
									{selectedPhotos.length > 0 && (
										<MotiView
											from={{ opacity: 0, width: 1 }}
											animate={{ opacity: 1, width: 60 }}
											exit={{ opacity: 0, width: 1 }}
											transition={{
												type: "timing",
												duration: 300,
												easing: Easing.out(Easing.poly(4)),
											}}
										>
											<Button
												variant="ghost"
												size="icon"
												onPress={() => onImagesSelected(selectedPhotos)}
											>
												<IconSend size={24} color={iconColor} />
											</Button>
										</MotiView>
									)}
								</AnimatePresence>
							</View>
						);
					},
				}}
			/>
			<View className="flex-1 w-full flex-col h-screen android:h-[80vh]">
				{Platform.OS === "android" && (
					<View className="w-full items-center">
						<View className="w-12 h-1 bg-muted rounded-full my-2" />
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
					onEndReached={() => {
						if (photos?.hasNextPage) {
							(async () => {
								const nextPhotos = await MediaLibrary.getAssetsAsync({
									first: 100,
									after: photos.endCursor,
								});
								setPhotos({
									...nextPhotos,
									assets: [...(photos?.assets || []), ...nextPhotos.assets],
								});
							})();
						}
					}}
					numColumns={3}
					contentContainerClassName="gap-1 px-1 pb-2"
					columnWrapperClassName="gap-1"
					ListFooterComponent={
						photos?.hasNextPage ? <View className="h-10 pb-safe" /> : null
					}
					renderItem={({ item, index }) => {
						if ("isCamera" in item) {
							return (
								<Pressable
									onPress={TakePhoto}
									className="aspect-square rounded-lg bg-secondary/75 items-center justify-center"
									style={{
										width: (width - 12) / 3 - 2,
									}}
									key={item.id}
								>
									<IconCamera size={42} color={iconColor} />
								</Pressable>
							);
						}

						return (
							<ContextMenu.Root>
								<ContextMenu.Trigger>
									<Pressable
										onPress={() => {
											trigger("impactMedium");

											if (!allowsMultipleSelection) {
												onImageSelected(item);
												return;
											}

											if (selectedPhotos.includes(item)) {
												setSelectedPhotos(
													selectedPhotos.filter(
														(photo) => photo.uri !== item.uri,
													),
												);
											} else {
												setSelectedPhotos([...selectedPhotos, item]);
											}
										}}
										className={cn(
											"aspect-square rounded-lg overflow-hidden relative transition-all duration-300 ease-out",
											// index === 2 && "rounded-tr-2xl",
											selectedPhotos.includes(item) &&
												"border-2 border-primary",
										)}
										key={item.filename}
										style={{
											width: (width - 12) / 3 - 2,
										}}
									>
										<AnimatePresence>
											{selectedPhotos.includes(item) && (
												<>
													<MotiView
														className="absolute top-1 right-1 bg-white rounded-full p-1 z-20"
														from={{
															opacity: 0,
															scale: 1.2,
														}}
														animate={{
															opacity: 1,
															scale: 1,
														}}
														exit={{
															opacity: 0,
															scale: 1.2,
														}}
														transition={{
															type: "timing",
															duration: 300,
															easing: Easing.out(Easing.poly(4)),
														}}
													>
														<IconCheck size={20} color={"#000"} />
													</MotiView>
													<MotiView
														className="absolute z-10 bg-primary/10 w-full h-full"
														from={{
															opacity: 0,
															scale: 1.2,
														}}
														animate={{
															opacity: 1,
															scale: 1,
														}}
														exit={{
															opacity: 0,
															scale: 1.2,
														}}
													/>
												</>
											)}
										</AnimatePresence>
										<Image
											source={{ uri: item.uri }}
											style={{
												width: "100%",
												height: "100%",
											}}
											key={item.uri}
											className="aspect-square rounded-lg"
											contentFit="cover"
											recyclingKey={item.id}
											cachePolicy="memory"
										/>
									</Pressable>
								</ContextMenu.Trigger>
								<ContextMenu.Preview borderRadius={30}>
									<Image
										source={{ uri: item.uri }}
										style={{
											width: width * 0.8,
											// aspectRatio: 1,
											// height: width * 0.8,
										}}
										key={`${item.uri}-preview`}
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
				<AnimatePresence>
					{selectedPhotos.length > 0 && (
						<MotiView
							className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-2"
							from={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<Text>Selected Photos</Text>
						</MotiView>
					)}
				</AnimatePresence>
			</View>
		</>
	);
}
