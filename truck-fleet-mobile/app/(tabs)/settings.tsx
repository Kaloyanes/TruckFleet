import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import LanguageSelector from "~/components/LanguageSelector";
import { Button } from "~/components/ui/button";
import {
	getAuth,
	signOut,
	onAuthStateChanged,
} from "@react-native-firebase/auth";
import { useRouter } from "expo-router";

export default function SettingsPage() {
	const [initializing, setInitializing] = useState(true);
	const [user, setUser] = useState();
	const router = useRouter();

	// Handle user state changes
	function onAuthStateChangedCallback(user: any) {
		setUser(user);
		if (initializing) setInitializing(false);
	}

	useEffect(() => {
		const subscriber = onAuthStateChanged(
			getAuth(),
			onAuthStateChangedCallback,
		);
		return subscriber; // unsubscribe on unmount
	}, []);

	if (initializing) return null;

	return (
		<View className="flex-1 items-center justify-center">
			<Text>SettingsPage</Text>
			<LanguageSelector />
			<Text>{user}</Text>
			<Button
				onPress={async () => {
					await router.replace("/on-board");
					await signOut(getAuth());
				}}
			>
				<Text>Sign Out</Text>
			</Button>
		</View>
	);
}
