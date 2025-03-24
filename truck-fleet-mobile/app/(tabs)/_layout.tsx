import { View, Text, useWindowDimensions, Platform } from "react-native";
import React from "react";
import {
	IconFile,
	IconHome,
	IconList,
	IconMap,
	IconMessage,
	IconSearch,
	IconSettings,
} from "@tabler/icons-react-native";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { router, Tabs, usePathname } from "expo-router";
import i18n from "~/locales/i18n";
import AuthRedirect from "~/components/redirects/AuthRedirect";

export default function LayoutTabs() {
	const { width } = useWindowDimensions();
	const { bottom } = useSafeAreaInsets();
	const isTablet = width > 600;
	const { t } = useTranslation();

	return (
		<AuthRedirect>
			<Tabs
				screenOptions={{
					headerShadowVisible: false,
					headerTransparent: true,
					headerBackground(props) {
						// if (Platform.OS === "android")
						// 	return <View className="bg-background flex-1" />;

						return (
							<BlurView
								experimentalBlurMethod="dimezisBlurView"
								intensity={20}
								className="flex-1 overflow-hidden !bg-background/50"
							/>
						);
					},

					tabBarStyle: {
						overflow: "hidden",
						position: isTablet ? "relative" : "absolute",
					},
					tabBarHideOnKeyboard: true,

					tabBarBackground() {
						// if (Platform.OS === "android")
						// 	return <View className="bg-background flex-1" />;

						const pathName = usePathname();
						const isMaps = pathName.includes("maps");

						return (
							<BlurView
								intensity={20}
								className="flex-1 overflow-hidden !bg-background/50 android:!bg-background"
							/>
						);
					},
					freezeOnBlur: true,
					animation: Platform.OS === "ios" ? "fade" : "shift",
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
					tabBarVisibilityAnimationConfig: {
						hide: {
							animation: "spring",
							config: {
								stiffness: 1000,
								damping: 50,
								mass: 3,
								restDisplacementThreshold: 0.01,
								restSpeedThreshold: 0.01,
							},
						},
						show: {
							animation: "spring",
							config: {
								stiffness: 1000,
								damping: 50,
								mass: 3,
								restDisplacementThreshold: 0.01,
								restSpeedThreshold: 0.01,
							},
						},
					},
					headerShown: false,
					lazy: false,

					headerTitleStyle: {
						fontFamily: "Manrope",
					},
					tabBarLabelStyle: {
						fontFamily: "Manrope",
					},
				}}
				screenListeners={{
					tabPress: (e) => {
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
					},
				}}
				safeAreaInsets={{ bottom: bottom }}
			>
				<Tabs.Screen
					name="index"
					options={{
						tabBarLabel: t("home"),
						tabBarIcon: ({ color }) => <IconHome color={color} size={24} />,
					}}
				/>
				<Tabs.Screen
					name="chat"
					options={{
						headerTitle: t("chat"),
						tabBarLabel: t("chat"),
						tabBarIcon: ({ color }) => <IconMessage color={color} size={24} />,
					}}
				/>
				<Tabs.Screen
					name="maps"
					options={{
						headerTitle: t("map"),
						tabBarLabel: t("map"),
						tabBarIcon: ({ color }) => <IconMap color={color} size={24} />,
					}}
				/>
				<Tabs.Screen
					name="documents"
					options={{
						tabBarLabel: t("documents"),
						tabBarIcon: ({ color }) => <IconFile color={color} size={24} />,
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
		</AuthRedirect>
	);
}
