import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

export const unstable_settings = {
	initialRouteName: "index",
};

export default function LayoutTabs() {
	return (
		<Tabs
			screenOptions={{
				headerShadowVisible: false,
				headerTransparent: true,
			}}
		>
			<Tabs.Screen name="index" />
			<Tabs.Screen name="list" />
		</Tabs>
	);
}
