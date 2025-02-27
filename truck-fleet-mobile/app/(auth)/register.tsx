import {
	ScrollView,
	StyleSheet,
	View,
	useWindowDimensions,
	type NativeSyntheticEvent,
	type NativeScrollEvent,
} from "react-native";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { Text } from "~/components/ui/text";
import Animated, {
	FadeInDown,
	LinearTransition,
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { useRegisterStore } from "~/stores/register-store";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function RegisterPage() {
	const { t } = useTranslation();
	const { width: viewWidth } = useWindowDimensions();
	const { bottom, top } = useSafeAreaInsets();
	const { data, currentIndex, setCurrentIndex, setProgress, reset } =
		useRegisterStore();

	const scrollViewRef = useRef<ScrollView>(null);

	const calculateProgress = (
		event: NativeSyntheticEvent<NativeScrollEvent>,
	) => {
		const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
		const currentScrollPosition = contentOffset.x;
		const maxScrollPosition = contentSize.width - layoutMeasurement.width;

		// Calculate progress directly on a 1-100 scale
		let progress = 0; // Default to 1 if there's no scrollable content

		if (maxScrollPosition > 0) {
			// Calculate percentage directly (1-100)
			progress =
				Math.round((currentScrollPosition / maxScrollPosition) * 99) + 1;

			// Ensure progress is between 1 and 100
			progress = Math.min(100, Math.max(0, progress));
		}

		setProgress(progress);
	};

	const handleContinue = () => {
		if (currentIndex < data.length - 1) {
			const nextIndex = currentIndex + 1;
			setCurrentIndex(nextIndex);

			scrollViewRef.current?.scrollTo({
				x: viewWidth * nextIndex,
				animated: true,
			});
		} else {
			router.dismissAll();
			router.replace("/(tabs)");
		}
	};

	const handleBack = () => {
		if (currentIndex > 0) {
			const nextIndex = currentIndex - 1;
			setCurrentIndex(nextIndex);

			scrollViewRef.current?.scrollTo({
				x: viewWidth * nextIndex,
				animated: true,
			});
			return;
		}

		router.back();
	};

	useEffect(() => {
		return () => {
			reset();
		};
	}, [reset]);

	// Effect to scroll when currentIndex changes (e.g., from header back button)
	useEffect(() => {
		scrollViewRef.current?.scrollTo({
			x: viewWidth * currentIndex,
			animated: true,
		});
	}, [currentIndex, viewWidth]);

	return (
		<Animated.View className="flex-1 relative">
			<View className="flex-1 ">
				<ScrollView
					ref={scrollViewRef}
					horizontal
					pagingEnabled
					scrollEnabled={false}
					showsHorizontalScrollIndicator={false}
					className="z-0 flex-1 w-screen h-screen "
					keyboardShouldPersistTaps="handled"
					onScroll={calculateProgress}
					scrollEventThrottle={8}
					// contentContainerStyle={{
					// 	alignItems: "center",
					// 	justifyContent: "center",
					// }}
				>
					{data.map((step, index) => (
						<View key={index} className="flex-1 !w-screen !h-[80%]">
							{step()}
						</View>
					))}
				</ScrollView>
			</View>

			<Animated.View
				entering={FadeInDown.springify().delay(200)}
				layout={LinearTransition.springify()}
				className="z-50"
			>
				<View className="absolute left-1/2 -translate-x-1/2 bottom-14 justify-center items-center">
					<AnimatedButton
						className=" w-[75vw] !h-16 items-center justify-center"
						onPress={() => {
							handleContinue();
						}}
						layout={LinearTransition.springify()}
					>
						<Text
							className="!text-xl text-primary-foreground"
							style={{
								fontFamily: "PlayfairDisplay_400Regular",
							}}
						>
							{currentIndex < data.length - 1 ? t("continue") : t("finish")}
						</Text>
					</AnimatedButton>
				</View>
			</Animated.View>
		</Animated.View>
	);
}
