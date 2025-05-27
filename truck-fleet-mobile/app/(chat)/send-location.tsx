import { View, Text, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import MapView, { Marker, MarkerAnimated } from "react-native-maps";
import { Button } from "~/components/ui/button";
import { useTranslation } from "react-i18next";
import * as Location from "expo-location";
import { toast } from "sonner-native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "~/lib/useColorScheme";
import { useMessageStore } from "~/stores/message-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SendLocationPage() {
	const { t } = useTranslation();

	const { isDarkColorScheme } = useColorScheme();
	const [region, setRegion] = useState({
		latitude: 42.698334,
		longitude: 23.319941,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});

	const { sendLocation } = useMessageStore();
	const { bottom } = useSafeAreaInsets();

	const [marker, setMarkerPosition] = useState({
		latitude: 42.698334,
		longitude: 23.319941,
	});

	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				toast.error("Permission to access location was denied");
				return;
			}

			const location = await Location.getCurrentPositionAsync({});

			const { latitude, longitude } = location.coords;
			setMarkerPosition({
				latitude,
				longitude,
			});
			setRegion({
				latitude,
				longitude,
				latitudeDelta: 0.0922,
				longitudeDelta: 0.0421,
			});
		})();
	}, []);

	return (
		<View className="flex-1 w-full flex-col h-screen android:h-[80vh] relative">
			{Platform.OS === "android" && (
				<View className="w-full items-center">
					<View className="w-12 h-1 bg-gray-400 rounded-full my-2" />
				</View>
			)}
			<MapView
				style={{ flex: 1, width: "100%", height: "100%", zIndex: 0 }}
				// ref={mapRef}
				showsUserLocation
				initialRegion={region}
				region={region}
				mapPadding={{
					bottom: bottom + 30,
					left: 0,
					right: 0,
					top: 0,
				}}
				onRegionChange={(prop) => {
					setMarkerPosition({
						latitude: prop.latitude,
						longitude: prop.longitude,
					});
				}}
				// followsUserLocation={followsUserLocation}
				loadingEnabled
				loadingBackgroundColor={isDarkColorScheme ? "#000" : "#fff"}
				rotateEnabled={false}
				// legalLabelInsets={{ bottom: bottom + 50, left: 0, right: 0, top: 50 }}
			>
				<Marker coordinate={marker} />
			</MapView>
			<Button
				className="w-[75%] z-50 absolute bottom-[15%] left-[13%]"
				onPress={() => sendLocation(marker.latitude, marker.longitude)}
			>
				<Text>{t("chats.send-location")}</Text>
			</Button>
		</View>
	);
}
