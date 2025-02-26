import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import firestore, { doc, setDoc } from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";

const LOCATION_TASK_NAME = "background-location-fetch";

TaskManager.defineTask(
	LOCATION_TASK_NAME,
	async ({
		data,
		error,
	}: TaskManager.TaskManagerTaskBody<{
		locations: Location.LocationObject[];
	}>) => {
		if (error) {
			console.error(`Error in background location task: ${error.message}`);
			return;
		}

		const { locations } = data;
		console.log(locations[0]);
		try {
			const dc = doc(getApp().firestore(), "locations/1");
			await setDoc(dc, {
				location: locations[0],
				timestamp: firestore.FieldValue.serverTimestamp(),
			});
		} catch (err) {
			console.error("Failed to update location in Firestore:", err);
		}
	},
);

export default function Home() {
	const [status, requestPermissions] = Location.useBackgroundPermissions();
	const [isServiceRunning, setIsServiceRunning] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// Check if background service is already running when component mounts
	useEffect(() => {
		async function checkServiceStatus() {
			try {
				const isRunning = await Location.hasStartedLocationUpdatesAsync(
					LOCATION_TASK_NAME,
				).catch(() => false);
				setIsServiceRunning(isRunning);
			} catch (error) {
				console.error("Error checking service status:", error);
				setIsServiceRunning(false);
			}
		}

		checkServiceStatus();
	}, []);

	async function toggleBackgroundService() {
		if (isLoading) return;

		setIsLoading(true);
		try {
			// Check current status first
			const isCurrentlyRunning = await Location.hasStartedLocationUpdatesAsync(
				LOCATION_TASK_NAME,
			).catch(() => false);

			if (isCurrentlyRunning) {
				await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
				console.log("Location service stopped");
				setIsServiceRunning(false);
				setIsLoading(false);
				return;
			}

			if (!status?.granted) {
				const permissionResult = await requestPermissions();
				if (!permissionResult || !permissionResult.granted) {
					console.log("Location permission denied");
					setIsLoading(false);
					return;
				}
			}

			await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
				accuracy: Location.Accuracy.BestForNavigation,
				timeInterval: 1000,
				activityType: Location.ActivityType.AutomotiveNavigation,
				showsBackgroundLocationIndicator: true,
				foregroundService: {
					notificationTitle: "Location tracking active",
					notificationBody: "Tracking vehicle location",
				},
			});

			console.log("Location service started");
			setIsServiceRunning(true);
		} catch (error) {
			console.error("Error managing background service:", error);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<View className="flex-1 justify-center items-center bg-background">
			<Text className="text-foreground text-xl font-bold mb-4">
				Truck Tracker
			</Text>
			<Button
				className="px-4 py-2"
				onPress={toggleBackgroundService}
				disabled={isLoading}
			>
				<Text className="text-primary-foreground">
					{isLoading ? "Processing..." : isServiceRunning ? "Stop" : "Start"}{" "}
					tracking
				</Text>
			</Button>
		</View>
	);
}
