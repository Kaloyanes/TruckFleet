import { View, Text, useWindowDimensions, Platform } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import {
	IconHome,
	IconList,
	IconMessage,
	IconSettings,
} from "@tabler/icons-react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";

export default function LayoutTabs() {
	const { width } = useWindowDimensions();
	const { bottom } = useSafeAreaInsets();
	const isTablet = width > 600;
	const { t } = useTranslation();

	return (
		<Tabs
			screenOptions={{
				headerShadowVisible: false,

				headerTransparent: true,

				headerBackground(props) {
					if (Platform.OS === "android")
						return <View className="bg-background flex-1" />;

					return (
						<BlurView intensity={20} tint="prominent" className="flex-1" />
					);
				},
				tabBarStyle: {
					borderCurve: "continuous",

					overflow: "hidden",
					position: isTablet ? "relative" : "absolute",
				},
				tabBarHideOnKeyboard: true,
				tabBarBackground() {
					if (Platform.OS === "android")
						return <View className="bg-background flex-1" />;

					return (
						<BlurView intensity={20} tint="prominent" className="flex-1" />
					);
				},
				animation: "fade",
				popToTopOnBlur: true,
				sceneStyle: {
					flex: 1,
				},

				transitionSpec: {
					animation: "spring",
					config: {
						stiffness: 1000,
						damping: 100,
						mass: 2,
						overshootClamping: false,
						restDisplacementThreshold: 0.05,
						restSpeedThreshold: 0.05,
					},
				},
				tabBarPosition: isTablet ? "left" : "bottom",
			}}
			screenListeners={{
				tabPress: (e) => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				},
			}}
			safeAreaInsets={{ left: -5, bottom: bottom }}
		>
			<Tabs.Screen
				name="index"
				options={{
					headerShown: false,
					tabBarLabel: t("home"),
					tabBarIcon: ({ color }) => <IconHome color={color} size={24} />,
				}}
			/>
			<Tabs.Screen
				name="list"
				options={{
					headerTitle: t("messages"),
					tabBarLabel: t("messages"),
					tabBarIcon: ({ color }) => <IconMessage color={color} size={24} />,
				}}
			/>
			<Tabs.Screen
				name="documents"
				options={{
					headerTitle: t("documents"),
					tabBarLabel: t("documents"),
					tabBarIcon: ({ color }) => <IconList color={color} size={24} />,
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					headerTitle: t("settings"),
					tabBarLabel: t("settings"),
					tabBarIcon: ({ color }) => <IconSettings color={color} size={24} />,
				}}
			/>
		</Tabs>
	);
}
