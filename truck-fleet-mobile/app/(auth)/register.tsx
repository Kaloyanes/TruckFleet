import {
	ScrollView,
	StyleSheet,
	View,
	useWindowDimensions,
	type NativeSyntheticEvent,
	type NativeScrollEvent,
	Keyboard,
} from "react-native";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { Text } from "~/components/ui/text";
import Animated, {
	FadeInDown,
	LinearTransition,
	useAnimatedKeyboard,
	useAnimatedRef,
	useAnimatedStyle,
	useDerivedValue,
	useSharedValue,
	scrollTo,
	withTiming,
	Easing,
	ReduceMotion,
	withSpring,
} from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { useRegisterStore } from "~/stores/register-store";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { MotiView } from "moti";
import NameStepPage from "./(registerSteps)/name-step";
import passwordStep from "./(registerSteps)/password-step";
import PasswordStepPage from "./(registerSteps)/password-step";
import ProfilePictureStepPage from "./(registerSteps)/profile-picture-step";

const AnimatedButton = Animated.createAnimatedComponent(Button);

export default function RegisterPage() {
	const { t } = useTranslation();
	const { width: viewWidth } = useWindowDimensions();
	const { bottom, top } = useSafeAreaInsets();

	const {
		currentIndex,
		setCurrentIndex,
		setProgress,
		reset,
		buttonDisabled,
		setButtonDisabled,
	} = useRegisterStore();

	useEffect(() => {
		setButtonDisabled(true);
	}, [setButtonDisabled]);

	const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
	const xValue = useSharedValue(0);

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

	const data = [
		ProfilePictureStepPage,
		NameStepPage,
		PasswordStepPage,
		ProfilePictureStepPage,
	];

	const handleContinue = () => {
		setButtonDisabled(true);
		Keyboard.dismiss();
		if (currentIndex < data.length - 1) {
			const nextIndex = currentIndex + 1;
			setCurrentIndex(nextIndex);
		} else {
			router.dismissAll();
			router.replace("/(tabs)");
		}
	};

	useEffect(() => {
		return () => {
			reset();
		};
	}, [reset]);

	useEffect(() => {
		xValue.value = currentIndex * viewWidth;
		// scrollTo(scrollViewRef, currentIndex * viewWidth, 0, false);
	}, [currentIndex, viewWidth, xValue]);

	useDerivedValue(() => {
		scrollTo(scrollViewRef, xValue.value, 0, true);
	}, [xValue.value]);

	const { height: keyboardHeight } = useAnimatedKeyboard({
		isNavigationBarTranslucentAndroid: true,
		isStatusBarTranslucentAndroid: true,
	});

	const animatedStyles = useAnimatedStyle(() => ({
		transform: [{ translateY: -keyboardHeight.value }],
	}));

	return (
		<Animated.View className="flex-1 relative">
			<View className="flex-1 ">
				<Animated.ScrollView
					ref={scrollViewRef}
					horizontal
					scrollEnabled={false}
					showsHorizontalScrollIndicator={false}
					className="z-0 flex-1 w-screen h-screen "
					keyboardShouldPersistTaps="handled"
					onScroll={calculateProgress}
					scrollEventThrottle={16}
				>
					{data.map((Component, index) => {
						return <Component key={index} />;
					})}
				</Animated.ScrollView>
			</View>

			<MotiView entering={FadeInDown.springify().duration(250)}>
				<MotiView
					transition={{
						type: "timing",
						delay: 0,
					}}
					style={animatedStyles}
					className="z-50"
				>
					<View
						className="absolute left-1/2 -translate-x-1/2 justify-center items-center"
						style={{
							bottom: bottom + 26,
						}}
					>
						<Button
							className=" w-[75vw] !h-16 items-center justify-center"
							onPress={() => {
								handleContinue();
							}}
							disabled={buttonDisabled}
						>
							<Text
								className="!text-xl text-primary-foreground"
								style={{
									fontFamily: "PlayfairDisplay_400Regular",
								}}
							>
								{currentIndex < data.length - 1 ? t("continue") : t("finish")}
							</Text>
						</Button>
					</View>
				</MotiView>
			</MotiView>
		</Animated.View>
	);
}
