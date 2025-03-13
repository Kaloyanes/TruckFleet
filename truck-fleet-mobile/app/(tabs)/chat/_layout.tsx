import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

export default function Layout() {
	const { t } = useTranslation();

	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerLargeTitle: true,
					headerTitle: t("chat"),
					headerBlurEffect: "prominent",
					headerTransparent: true,
					headerShadowVisible: false,
					headerLargeTitleShadowVisible: false,

					headerLargeStyle: {
						backgroundColor: "transparent",
					},
				}}
			/>
		</Stack>
	);
}
