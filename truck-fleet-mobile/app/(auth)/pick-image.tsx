import { Platform, Pressable, View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { IconCamera, IconPhoto } from "@tabler/icons-react-native";
import * as ImagePicker from "expo-image-picker";
import { useRegisterStore } from "~/stores/register-store";
import { useColorScheme } from "~/lib/useColorScheme";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ImagePickerComponent from "~/components/ImagePicker";

export default function PickMethodPage() {
	const { setProfilePicture, updateValidPage } = useRegisterStore();

	return (
		<ImagePickerComponent
			onImageSelected={(asset) => {
				setProfilePicture(asset);
				router.back();
				updateValidPage(3, true);
			}}
		/>
	);
}
