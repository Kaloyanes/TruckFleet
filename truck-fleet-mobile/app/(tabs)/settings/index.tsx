import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import LanguageSelector from "~/components/LanguageSelector";
import { Button } from "~/components/ui/button";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";
import { ReactNativeLegal } from "react-native-legal";
import {
	useImmersiveOverlay,
	useImmersiveOverlayStore,
} from "~/components/ui/immersive-overlay/store";
import { trigger } from "react-native-haptic-feedback";
import { Canvas, Circle, Group } from "@shopify/react-native-skia";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
export default function SettingsPage() {
	const router = useRouter();
	const { immerse, dismiss } = useImmersiveOverlay();
	const tabHeight = useBottomTabBarHeight();

	return (
		<BodyScrollView
			scrollIndicatorInsets={{ bottom: tabHeight - 32 }}
			automaticallyAdjustContentInsets
			automaticallyAdjustsScrollIndicatorInsets
			className="flex-1"
			contentContainerClassName="mx-6 flex flex-col gap-4 "
		>
			<LanguageSelector />
			<Text>{auth().currentUser?.email}</Text>
			<Button
				onPress={async () => {
					immerse({
						colors: {
							primary: "#8B5CF6",
							secondary: "#6366F1",
							expanding: {
								dark: ["#8B5CF6", "#7C3AED", "#6366F1"],
								light: ["#8B5CF6", "#7C3AED", "#6366F1"],
							},
						},
						component: (
							<View className="mt-auto justify-center p-8 flex flex-col gap-8">
								<Text className="text-2xl font-bold">
									Are you sure you want to sign out?
								</Text>
								<View className="flex flex-col gap-4">
									<Button
										variant="outline"
										size={"lg"}
										onPress={() => {
											trigger("impactHeavy");

											auth().signOut();
											router.replace("/on-board");
										}}
									>
										<Text>Sign Out</Text>
									</Button>
									<Button
										size={"lg"}
										onPressIn={() => {
											trigger("impactLight");
											dismiss();
										}}
									>
										<Text>Cancel</Text>
									</Button>
								</View>
							</View>
						),
					});
				}}
			>
				<Text>Sign Out</Text>
			</Button>
			<Button
				onPress={() => {
					ReactNativeLegal.launchLicenseListScreen("Licenses");
				}}
			>
				<Text>Licenses</Text>
			</Button>
		</BodyScrollView>
	);
}
