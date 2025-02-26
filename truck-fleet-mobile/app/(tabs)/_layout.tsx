import { View, Text, useWindowDimensions } from "react-native";
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

export const unstable_settings = {
	initialRouteName: "index",
};

export default function LayoutTabs() {
	const { width } = useWindowDimensions();
	const { bottom } = useSafeAreaInsets();

	return (
		<Tabs
			screenOptions={{
				headerShadowVisible: false,
				headerTransparent: false,
				headerBackground(props) {
					return (
						<BlurView
							style={{ backgroundColor: "rgba(0,0,0,0.5)", height: 100 }}
						/>
					);
				},
				animation: "fade",
				popToTopOnBlur: true,
				tabBarPosition: width > 600 ? "left" : "bottom",
			}}
			screenListeners={{
				tabPress: (e) => {
					Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				},
			}}
			safeAreaInsets={{ left: -5, bottom: bottom + 10 }}
		>
			<Tabs.Screen
				name="index"
				options={{
					headerShown: false,
					tabBarLabel: "Home",
					tabBarIcon: ({ color }) => <IconHome color={color} size={24} />,
				}}
			/>
			<Tabs.Screen
				name="list"
				options={{
					headerTitle: "Messages",
					tabBarLabel: "Messages",
					tabBarIcon: ({ color }) => <IconMessage color={color} size={24} />,
					headerTransparent: true,
					headerBackground(props) {
						return (
							<View
								style={{ backgroundColor: "rgba(0,0,0,0.5)", height: 100 }}
							/>
						);
					},
				}}
			/>
			<Tabs.Screen
				name="documents"
				options={{
					headerTitle: "Documents",
					tabBarLabel: "Documents",
					tabBarIcon: ({ color }) => <IconList color={color} size={24} />,
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					headerTitle: "Settings",
					tabBarLabel: "Settings",
					tabBarIcon: ({ color }) => <IconSettings color={color} size={24} />,
				}}
			/>
		</Tabs>
	);
}
