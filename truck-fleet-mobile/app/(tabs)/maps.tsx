import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import MapView, { type Camera } from "react-native-maps";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

export default function maps() {
	const { top } = useSafeAreaInsets();
	const [region, setRegion] = useState({
		latitude: 42.698334,
		longitude: 23.319941,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});

	const tabHeight = useBottomTabBarHeight();

	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				console.error("Permission to access location was denied");
				return;
			}
			const location = await Location.getCurrentPositionAsync({});
			const { latitude, longitude } = location.coords;
			setRegion({
				latitude,
				longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			});
		})();
	}, []);

	return (
		<View className="flex-1">
			<BlurView
				intensity={20}
				className="absolute  inset-0 z-50  overflow-hidden bg-transparent"
				style={{ height: top }}
				experimentalBlurMethod="dimezisBlurView"
			/>
			<MapView
				style={{ width: "100%", height: "100%" }}
				showsMyLocationButton
				showsUserLocation
				initialRegion={{
					latitude: 42.698334,
					longitude: 23.319941,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				}}
				region={region}
				mapPadding={{
					bottom: tabHeight - 30,
					left: -10,
					right: 0,
					top,
				}}
				userLocationCalloutEnabled
				onUserLocationChange={(event) => {}}
				loadingEnabled
				loadingBackgroundColor="#ffffff00"
				loadingIndicatorColor="#71717a"
				showsTraffic
			/>
		</View>
	);
}
