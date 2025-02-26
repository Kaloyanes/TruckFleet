import {
	View,
	type ScrollView,
	Dimensions,
	useAnimatedValue,
} from "react-native";
import React, { useEffect, useRef } from "react";
import { Text } from "~/components/ui/text";
import Animated, {
	FadeInDown,
	useAnimatedRef,
	useScrollViewOffset,
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import * as Haptics from "expo-haptics";
import { useRegisterStore } from "~/stores/register-store";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function RegisterPage() {
	// Using the register store instead of local state
	const { data, currentIndex, setCurrentIndex, setProgress, reset } =
		useRegisterStore();
	const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollViewRef);

	const screenWidth = Dimensions.get("window").width;

	useEffect(() => {
		setProgress(((currentIndex + 1) / data.length) * 100);
	}, [currentIndex, data.length, setProgress]);

	// Unmount hook: reset the store on unmount
	useEffect(() => {
		return () => reset();
	}, [reset]);

	const handleContinue = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
		let nextIndex = currentIndex;
		nextIndex = currentIndex + 1;
		setCurrentIndex(nextIndex);
		scrollViewRef.current?.scrollTo({
			x: nextIndex * screenWidth,
			animated: true,
		});
	};

	return (
		<View className="flex-1 relative">
			<Animated.ScrollView
				ref={scrollViewRef}
				horizontal
				pagingEnabled
				decelerationRate={"normal"}
				scrollEnabled={false}
				showsHorizontalScrollIndicator={false}
				overScrollMode="never"
				style={{ flex: 1 }}
			>
				{/* {data.map((item, index) => (
					<View
						key={index}
						className="flex-1 justify-center items-center"
						style={{ width: screenWidth }}
					>
						<Text className="text-6xl !font-base">{item}</Text>
					</View>
				))} */}
				<View className="flex-1 justify-center items-center">
					<Text className="text-6xl !font-base">Last page</Text>
					<Button
						onPress={async () => {
							const f = await ImagePicker.requestCameraPermissionsAsync();

							if (!f.granted) {
								alert("Permission denied");
								return;
							}

							await ImagePicker.launchCameraAsync({
								allowsEditing: true,
								aspect: [1, 1],
							});
						}}
					>
						<Text>Dismiss</Text>
					</Button>
				</View>
			</Animated.ScrollView>

			<Animated.View className="absolute bottom-safe-offset-6 left-1/2 -translate-x-1/2">
				<Animated.View entering={FadeInDown.springify().delay(300)}>
					<Button className="w-[75vw] !h-16" onPress={handleContinue}>
						<Text className="!text-xl text-primary-foreground">Continue</Text>
					</Button>
				</Animated.View>
			</Animated.View>
		</View>
	);
}
