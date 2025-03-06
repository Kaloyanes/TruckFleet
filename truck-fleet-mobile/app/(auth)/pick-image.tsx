import { Platform, Pressable, View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { IconCamera, IconPhoto } from "@tabler/icons-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRegisterStore } from "~/stores/register-store";
import { useColorScheme } from "~/lib/useColorScheme";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function PickMethodPage() {
	const { t } = useTranslation();
	const { setProfilePicture, updateValidPage } = useRegisterStore();

	async function TakePhoto() {
		await impactAsync(ImpactFeedbackStyle.Light);

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
			setProfilePicture(result.assets[0]);
			router.back();
			updateValidPage(3, true);
		}
	}

	async function PickFromGallery() {
		await impactAsync(ImpactFeedbackStyle.Light);

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
			setProfilePicture(result.assets[0]);
			router.back();
			updateValidPage(3, true);
		}
	}

	const { isDarkColorScheme } = useColorScheme();

	const iconColor = isDarkColorScheme ? "#fff" : "#71717a";

	return (
		<View className="flex-1 w-full flex-col h-screen android:h-[80vh]">
			{Platform.OS === "android" && (
				<View className="w-full items-center">
					<View className="w-12 h-1 bg-gray-400 rounded-full my-2" />
				</View>
			)}
			<Pressable onPress={TakePhoto} className="flex-1 ">
				<View className="flex-col items-center justify-center flex-1">
					<IconCamera size={120} color={iconColor} />
					<Text className="text-5xl">{t("take_photo")}</Text>
				</View>
			</Pressable>
			<Pressable onPress={PickFromGallery} className="flex-[2]">
				<View className="flex-col items-center justify-center flex-1">
					<IconPhoto size={120} color={iconColor} />
					<Text className="text-5xl">{t("pick_from_gallery")}</Text>
				</View>
			</Pressable>
		</View>
	);
}
