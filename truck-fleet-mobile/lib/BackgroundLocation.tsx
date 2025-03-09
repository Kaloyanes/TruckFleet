import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {
	doc,
	getFirestore,
	runTransaction,
	serverTimestamp,
	setDoc,
	collection,
	query,
	where,
	getDocs,
	updateDoc,
} from "@react-native-firebase/firestore";
import { getApp } from "@react-native-firebase/app";
import { useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import { getDoc } from "@react-native-firebase/firestore";
import { MMKV } from "react-native-mmkv";

export const LOCATION_TASK_NAME = "background-location-fetch";

const mmkv = new MMKV({
	id: "kaloyanes.km",
});

// Add this function before TaskManager.defineTask
function calculateDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number,
): number {
	const R = 6371; // Earth's radius in km
	const dLat = ((lat2 - lat1) * Math.PI) / 180;
	const dLon = ((lon2 - lon1) * Math.PI) / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

// Define the background location task
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

		const today = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
		const { locations } = data;
		const currentCoords = locations[0].coords;

		try {
			// Update Firestore
			const dc = doc(getApp().firestore(), `users/${auth().currentUser?.uid}`);
			await updateDoc(dc, {
				location: {
					...currentCoords,
					timestamp: serverTimestamp(),
				},
			});

			// Get last coordinates from MMKV
			const lastCoordsStr = mmkv.getString(`last_coords_${today}`);
			if (lastCoordsStr) {
				const lastCoords = JSON.parse(lastCoordsStr);
				const distance = calculateDistance(
					lastCoords.latitude,
					lastCoords.longitude,
					currentCoords.latitude,
					currentCoords.longitude,
				);

				// Update daily total
				const currentTotal = mmkv.getNumber(`km_${today}`) || 0;
				mmkv.set(`km_${today}`, currentTotal + distance);
			}

			// Store current coordinates for next calculation
			mmkv.set(
				`last_coords_${today}`,
				JSON.stringify({
					latitude: currentCoords.latitude,
					longitude: currentCoords.longitude,
				}),
			);
		} catch (err) {
			console.error("Failed to update location data:", err);
		}
	},
);

// Request location permissions
export const requestLocationPermissions = async (): Promise<boolean> => {
	const { status: foregroundStatus } =
		await Location.requestForegroundPermissionsAsync();
	if (foregroundStatus === "granted") {
		const { status: backgroundStatus } =
			await Location.requestBackgroundPermissionsAsync();
		return backgroundStatus === "granted";
	}
	return false;
};

// Start background location tracking
export const startBackgroundLocationTracking = async (notificationConfig: {
	notificationTitle: string;
	notificationBody: string;
}): Promise<boolean> => {
	try {
		const hasPermission = await requestLocationPermissions();
		if (!hasPermission) return false;

		await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
			accuracy: Location.Accuracy.BestForNavigation,
			activityType: Location.ActivityType.AutomotiveNavigation,
			showsBackgroundLocationIndicator: true,
			foregroundService: {
				notificationTitle: notificationConfig.notificationTitle,
				notificationBody: notificationConfig.notificationBody,
			},
			distanceInterval: 100,
		});
		return true;
	} catch (error) {
		console.error("Error starting location tracking:", error);
		return false;
	}
};

// Stop background location tracking
export const stopBackgroundLocationTracking = async (): Promise<boolean> => {
	try {
		await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
		return true;
	} catch (error) {
		console.error("Error stopping location tracking:", error);
		return false;
	}
};

// Check if background location tracking is running
export const isBackgroundLocationTrackingRunning =
	async (): Promise<boolean> => {
		try {
			return await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
		} catch {
			return false;
		}
	};

// Hook to manage background location tracking
export const useBackgroundLocation = () => {
	const [isServiceRunning, setIsServiceRunning] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		// Check if service is running on mount
		async function checkServiceStatus() {
			try {
				const isRunning = await isBackgroundLocationTrackingRunning();
				setIsServiceRunning(isRunning);
			} catch (error) {
				console.error("Error checking service status:", error);
				setIsServiceRunning(false);
			}
		}

		checkServiceStatus();
	}, []);

	const toggleBackgroundService = async (notificationConfig: {
		notificationTitle: string;
		notificationBody: string;
	}) => {
		if (isLoading) return;

		setIsLoading(true);
		try {
			// Check current status
			const isCurrentlyRunning = await isBackgroundLocationTrackingRunning();

			if (isCurrentlyRunning) {
				await stopBackgroundLocationTracking();
				console.log("Location service stopped");
				setIsServiceRunning(false);
			} else {
				const success =
					await startBackgroundLocationTracking(notificationConfig);
				console.log("Location service started:", success);
				setIsServiceRunning(success);
			}
		} catch (error) {
			console.error("Error managing background service:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isServiceRunning,
		isLoading,
		toggleBackgroundService,
	};
};
