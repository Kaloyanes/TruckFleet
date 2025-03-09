import {
	type NativeScrollEvent,
	type NativeSyntheticEvent,
	View,
} from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { useBackgroundLocation } from "~/lib/BackgroundLocation";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BodyScrollView } from "~/components/ui/body-scroll-view";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Redirect } from "expo-router";
import KmChart from "~/components/home/KmChart";
import GreetingText from "~/components/home/GreetingText";
import {
	interpolate,
	useAnimatedScrollHandler,
	useAnimatedStyle,
	useSharedValue,
} from "react-native-reanimated";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useColorScheme } from "~/lib/useColorScheme";

export default function Home() {
	const { t } = useTranslation();
	const { isServiceRunning, isLoading, toggleBackgroundService } =
		useBackgroundLocation();
	const { top } = useSafeAreaInsets();
	const tabHeight = useBottomTabBarHeight();
	const { isDarkColorScheme } = useColorScheme();

	const handleToggleTracking = async () => {
		await toggleBackgroundService({
			notificationTitle: t("location_service_active"),
			notificationBody: t("tracking_vehicle_location"),
		});
	};

	const y = useSharedValue(0);
	const onScroll = useAnimatedScrollHandler({
		onScroll: (event) => {
			y.value = event.contentOffset.y;
		},
	});

	const gap = useAnimatedStyle(() => ({
		gap: interpolate(y.value, [-300, -62], [75, 20], "clamp"),
	}));

	return (
		<View className="flex-1 bg-background">
			<BlurView
				intensity={20}
				className="absolute inset-0 z-10 overflow-hidden bg-background/20"
				style={{ height: top + 10 }}
				experimentalBlurMethod="dimezisBlurView"
			/>
			<LinearGradient
				// Background Linear Gradient
				colors={[
					isDarkColorScheme ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
					"transparent",
				]}
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 0,
					height: 50,
				}}
			/>
			<BodyScrollView
				onScroll={onScroll}
				scrollIndicatorInsets={{ bottom: tabHeight, top }}
				automaticallyAdjustsScrollIndicatorInsets={false}
				bouncesZoom
				pinchGestureEnabled
				contentContainerClassName="pt-5"
			>
				<Animated.View style={[gap]} className="flex-1">
					<GreetingText />
					<KmChart />

					<View className="px-5">
						<Button
							className="px-4 py-2"
							onPress={handleToggleTracking}
							disabled={isLoading}
						>
							<Text className="text-primary-foreground">
								{isLoading
									? t("processing")
									: isServiceRunning
										? t("stop_tracking")
										: t("start_tracking")}
							</Text>
						</Button>

						<View style={{ height: tabHeight }} />
					</View>
					{new Array(10).fill(0).map((_, index) => (
						<View key={index} className="h-20 bg-background">
							<Text>{index}</Text>
						</View>
					))}
				</Animated.View>
			</BodyScrollView>
		</View>
	);
}
