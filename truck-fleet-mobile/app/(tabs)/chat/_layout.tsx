import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";
import { useChatStore } from "~/stores/chat-store";
import { useColorScheme } from "~/lib/useColorScheme";

export default function Layout() {
	const { t } = useTranslation();
	const { isDarkColorScheme } = useColorScheme();
	const { searchChat } = useChatStore();

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

					headerLargeTitleStyle: {
						fontFamily: "Manrope",
					},
					headerTitleStyle: {
						fontFamily: "Manrope",
					},
					headerLargeStyle: {
						backgroundColor: "transparent",
					},
					headerSearchBarOptions: {
						hideWhenScrolling: false,
						placeholder: t("chats.search"),
						cancelButtonText: t("chats.cancel"),
						headerIconColor: isDarkColorScheme ? "#fff" : "#71717a",
						onChangeText(e) {
							searchChat(e.nativeEvent.text.trim());
						},
						onBlur() {
							searchChat("");
						},
					},
				}}
			/>
		</Stack>
	);
}
