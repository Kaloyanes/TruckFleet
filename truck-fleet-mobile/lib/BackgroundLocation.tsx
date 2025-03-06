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

export const LOCATION_TASK_NAME = "background-location-fetch";

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

		const user = auth().currentUser;
		const { locations } = data;
		console.log(locations[0]);
		try {
			const dc = doc(getApp().firestore(), `users/${user?.uid}`);
			await updateDoc(dc, {
				location: {
					...locations[0].coords,
					timestamp: serverTimestamp(),
				},
			});
		} catch (err) {
			console.error("Failed to update location in Firestore:", err);
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
			distanceInterval: 5,
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
