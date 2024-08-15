import { Link, useRouter } from "expo-router";
import { Button, Text, View } from "react-native";
import * as Notification from "expo-notifications";
import { useEffect } from "react";
import { FlatList } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import Animated, {
	Easing,
	useAnimatedStyle,
	useSharedValue,
	withSpring,
	withTiming,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";

export default function Index() {
	const router = useRouter();

	useEffect(() => {
		Notification.setNotificationHandler({
			handleNotification: async () => ({
				shouldShowAlert: true,
				shouldPlaySound: true,
				shouldSetBadge: false,
			}),
		});

		async function getNotificationPermission() {
			await Notification.requestPermissionsAsync();
			await NavigationBar.setPositionAsync("absolute");
			await NavigationBar.setBackgroundColorAsync("#ffffff00");
		}

		getNotificationPermission();
	}, []);

	async function sendNotification() {
		await Notification.scheduleNotificationAsync({
			content: {
				title: "My Notification",
				body: "This is the body of the notification",
				data: { data: "goes here" },
			},
			trigger: null,
		});
	}
	const data = Array.from({ length: 1000 }, (_, index) => ({
		id: index.toString(),
		text: `Text ${index + 1}`,
	}));

	const randomWidth = useSharedValue(10);

	const config = {
		duration: 500,
		easing: Easing.bezier(0.5, 0.01, 0, 1),
	};

	const style = useAnimatedStyle(() => {
		return {
			width: withSpring(randomWidth.value, {
				velocity: 0.2,
				damping: 50,
			}),
		};
	});

	return (
		<View>
			<StatusBar style="inverted" />
			<Animated.View
				style={[
					{ width: 100, height: 80, backgroundColor: "black", margin: 30 },
					style,
				]}
			/>
			<Button
				title="toggle"
				onPress={() => {
					randomWidth.value = Math.random() * 350;
				}}
			/>
			<Text>Edit app/index.tsx to edit this screen.</Text>
			<Button
				title="Go next"
				onPress={() => {
					router.push("/about");
				}}
			/>

			<Button title="Send Notification" onPress={sendNotification} />

			<FlatList
				style={{ width: "100%" }}
				data={data}
				renderItem={({ item }) => <Text>{item.text}</Text>}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
}
