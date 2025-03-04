import type React from "react";
import { useEffect, useState } from "react";
import { Redirect, SplashScreen } from "expo-router";
import auth, { onAuthStateChanged } from "@react-native-firebase/auth";
import { ActivityIndicator } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { View } from "lucide-react-native";
import { getApp } from "@react-native-firebase/app";

interface AuthRedirectProps {
	children: React.ReactNode;
}

const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
	// Set an initializing state whilst Firebase connects
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState();

	// Handle user state changes
	function authStateChange(user: any) {
		console.log(user);

		setUser(user);
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
