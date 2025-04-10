import type React from "react";
import { useEffect, useState } from "react";
import { Redirect, SplashScreen } from "expo-router";
import auth, { onAuthStateChanged } from "@react-native-firebase/auth";
import { ActivityIndicator } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { View } from "lucide-react-native";
import { getApp } from "@react-native-firebase/app";
import { MMKV } from "react-native-mmkv";
import { useProfileStore } from "~/stores/profile-store";
import {
	stopBackgroundLocationTracking,
	isBackgroundLocationTrackingRunning,
} from "~/services/background-location-service";

interface AuthRedirectProps {
	children: React.ReactNode;
}
const mmkv = new MMKV({
	id: "kaloyanes.auth",
});

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
	// Set an initializing state whilst Firebase connects
	const [initializing, setInitializing] = useState(true);
	const { user, setUser } = useProfileStore();

	// Handle user state changes
	async function authStateChange(user: any) {
		setUser(user);
		if (
			!user &&
			!initializing &&
			(await isBackgroundLocationTrackingRunning())
		) {
			await stopBackgroundLocationTracking();
		}
		if (initializing) setInitializing(false);
		SplashScreen.hideAsync();
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(authStateChange);
		return subscriber; // unsubscribe on unmount
	}, []);

	if (initializing) return null;

	if (!user) {
		return <Redirect href={"/on-board"} />;
	}

	return <>{children}</>;
};

export default AuthRedirect;
