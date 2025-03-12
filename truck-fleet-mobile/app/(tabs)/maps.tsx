import { View, ActivityIndicator } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import MapView, {
	Marker,
	PROVIDER_GOOGLE,
	type Camera,
} from "react-native-maps";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MotiView, useAnimationState, useDynamicAnimation } from "moti";
import { useColorScheme } from "~/lib/useColorScheme";
import { usePathname } from "expo-router";
import { Button } from "~/components/ui/button";
import { IconLocation, IconPlus } from "@tabler/icons-react-native";
import { toast } from "sonner-native";
import MapViewDirections from "react-native-maps-directions";
import FabButton from "~/components/FabButton";

export default function maps() {
	const { top } = useSafeAreaInsets();
	const [isMapReady, setIsMapReady] = useState(false);
	const [region, setRegion] = useState({
		latitude: 42.698334,
		longitude: 23.319941,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	});

	const [followsUserLocation, setFollowsUserLocation] = useState(true);

	const mapRef = React.useRef<MapView>(null);

	const tabHeight = useBottomTabBarHeight();
	const { isDarkColorScheme } = useColorScheme();
	const pathName = usePathname();

	const states = useAnimationState({
		from: {
			scale: 0.2,
			translateY: 200,
		},
		to: {
			scale: 1,
			translateY: 0,
		},
	});

	useEffect(() => {
		if (pathName.includes("maps")) {
			states.transitionTo("to");
		} else {
			states.transitionTo("from");
		}
	}, [pathName, states.transitionTo]);

	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== "granted") {
				toast.error("Permission to access location was denied");
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

	async function handleCenter() {
		const location = await Location.getCurrentPositionAsync({});

		const { latitude, longitude } = location.coords;
		mapRef.current?.animateCamera({
			center: {
				latitude,
				longitude,
			},
			altitude: 10000,
			zoom: 10,
		});
		setFollowsUserLocation(true);
	}

	const googleMapsApi = process.env.EXPO_PUBLIC_GOOGLE_API_KEY ?? "";

	return (
		<View className="flex-1 relative">
			<BlurView
				intensity={20}
				className="absolute  inset-0 z-50  overflow-hidden bg-transparent"
				style={{ height: top }}
				experimentalBlurMethod="dimezisBlurView"
			/>

			<MapView
				style={{
					width: "100%",
					height: "100%",
				}}
				ref={mapRef}
				showsUserLocation
				initialRegion={region}
				region={region}
				mapPadding={{
					bottom: tabHeight - 30,
					left: -5,
					right: 0,
					top,
				}}
				// followsUserLocation={followsUserLocation}
				loadingEnabled
				loadingBackgroundColor={isDarkColorScheme ? "#000" : "#fff"}
				rotateEnabled={false}
			/>

			<FabButton
				path="maps"
				icon={() => (
					<IconLocation size={28} color={isDarkColorScheme ? "#000" : "#fff"} />
				)}
				onPress={handleCenter}
			/>
		</View>
	);
}
