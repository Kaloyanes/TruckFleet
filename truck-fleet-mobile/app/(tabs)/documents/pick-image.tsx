import { View, Text } from "react-native";
import React from "react";
import ImagePickerComponent from "~/components/ImagePicker";
import { useDocumentStore } from "~/stores/document-store";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function PickImageView() {
	const { t } = useTranslation();
	const { setCurrentDoc } = useDocumentStore();

	return (
		<ImagePickerComponent
			onImageSelected={async (asset) => {
				setCurrentDoc({
					name:
						asset.fileName || `${t("pick_image")} ${new Date().toISOString()}`,
					type: "picture",
					uri: asset.uri,
				});

				router.back();
			}}
		/>
	);
}
