import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import LanguageSelector from "~/components/LanguageSelector";
import { Button } from "~/components/ui/button";
import auth from "@react-native-firebase/auth";
import { useRouter } from "expo-router";

export default function SettingsPage() {
	const router = useRouter();

	return (
		<View className="flex-1 items-center justify-center">
			<Text>SettingsPage</Text>
			<LanguageSelector />
			<Text>{auth().currentUser?.email}</Text>
			<Button
				onPress={async () => {
					await auth().signOut();
				}}
			>
				<Text>Sign Out</Text>
			</Button>
		</View>
	);
}
