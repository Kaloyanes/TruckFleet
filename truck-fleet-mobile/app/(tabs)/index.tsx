import { View } from "react-native";
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
import KmChart from "~/components/KmChart";
import GreetingText from "~/components/GreetingText";

export default function Home() {
	const { t } = useTranslation();
	const { isServiceRunning, isLoading, toggleBackgroundService } =
		useBackgroundLocation();
	const { top } = useSafeAreaInsets();
	const tabHeight = useBottomTabBarHeight();

	const handleToggleTracking = async () => {
		await toggleBackgroundService({
			notificationTitle: t("location_service_active"),
			notificationBody: t("tracking_vehicle_location"),
		});
	};

	return (
		<View className="flex-1 bg-background">
			<BlurView
				intensity={20}
				className="absolute  inset-0 z-50  overflow-hidden bg-background/50"
				style={{ height: top }}
				experimentalBlurMethod="dimezisBlurView"
			/>
			<BodyScrollView
				contentContainerClassName=" w-full"
				scrollIndicatorInsets={{ bottom: tabHeight, top }}
				automaticallyAdjustsScrollIndicatorInsets={false}
			>
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
			</BodyScrollView>
		</View>
	);
}
