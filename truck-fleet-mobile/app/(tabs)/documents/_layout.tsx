import { View, Text, Platform } from "react-native";
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
					headerTitle: t("documents"),
					// headerBlurEffect: "systemMaterial", // Temporarily removed
					// headerTransparent: true, // Temporarily removed
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
			<Stack.Screen
				name="pick-image"
				options={{
					headerTitle: t("pick_image"),
					headerBlurEffect: "systemMaterial",
					headerTransparent: true,
					headerLargeStyle: {
						backgroundColor: "transparent",
					},
					headerLargeTitle: true,
					sheetCornerRadius: 25,
					sheetGrabberVisible: true,
					presentation: "formSheet",
					sheetAllowedDetents: Platform.OS === "ios" ? [1] : [0.9],
					gestureDirection: "vertical",
					headerShadowVisible: false,
					headerLargeTitleShadowVisible: false,
					// title: t("pick_image"),
				}}
			/>
			<Stack.Screen
				name="new-document"
				options={{
					headerTitle: t("new_document"),
					headerBlurEffect: "systemMaterial",
					headerTransparent: true,
					headerLargeStyle: {
						backgroundColor: "transparent",
					},
					headerLargeTitle: true,
					sheetCornerRadius: 25,
					sheetGrabberVisible: true,
					presentation: "formSheet",
					sheetAllowedDetents: Platform.OS === "ios" ? [1] : [0.9],
					gestureDirection: "vertical",
					headerShadowVisible: false,
					headerLargeTitleShadowVisible: false,
					// title: t("new_document"),
				}}
			/>
		</Stack>
	);
}
