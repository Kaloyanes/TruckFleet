import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import { useBackgroundLocation } from "~/lib/BackgroundLocation";

export default function Home() {
	const { t } = useTranslation();
	const { isServiceRunning, isLoading, toggleBackgroundService } =
		useBackgroundLocation();

	const handleToggleTracking = async () => {
		await toggleBackgroundService({
			notificationTitle: t("location_service_active"),
			notificationBody: t("tracking_vehicle_location"),
		});
	};

	return (
		<View className="flex-1 justify-center items-center bg-background">
			<Text className="text-foreground text-xl font-bold mb-4">
				{t("truck_tracker")}
			</Text>
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
		</View>
	);
}
