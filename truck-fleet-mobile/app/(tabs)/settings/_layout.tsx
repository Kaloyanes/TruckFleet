import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";

export default function Layout() {
	const { t } = useTranslation();

	return (
		<Stack>
			<Stack.Screen
				name="index"
				options={{
					headerLargeTitle: true,
					headerTitle: t("settings"),
					headerBlurEffect: "systemMaterial",
					headerTransparent: true,
					headerShadowVisible: false,
					headerLargeTitleShadowVisible: false,
					headerLargeStyle: {
						backgroundColor: "transparent",
					},
					headerLargeTitleStyle: {
						fontFamily: "Manrope",
					},
					headerTitleStyle: {
						fontFamily: "Manrope",
					},
				}}
			/>
		</Stack>
	);
}
