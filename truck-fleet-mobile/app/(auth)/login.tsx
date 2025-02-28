import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
	const { t } = useTranslation();

	return (
		<View className="flex-1 justify-center items-center">
			<Text>{t("sign_in_title")}</Text>
		</View>
	);
}
