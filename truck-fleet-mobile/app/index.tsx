import * as React from "react";
import { Dimensions, useWindowDimensions, View } from "react-native";
import Animated, {
	Easing,
	FadeInUp,
	FadeOutDown,
	interpolate,
	LayoutAnimationConfig,
	useAnimatedKeyboard,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";
import { Info } from "~/lib/icons/Info";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Text } from "~/components/ui/text";

import { Image, useImage } from "expo-image";
import { ThemeToggle } from "~/components/ThemeToggle";
import { trigger } from "react-native-haptic-feedback";
import { colorScheme, useColorScheme, vars } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Mail } from "~/lib/icons/Mail";
import BlurredImage from "~/components/BlurredImage";
import { useRouter } from "expo-router";

export default function Screen() {
	const image = require("~/assets/images/landing.jpg");
	const { width, height: screenHeight } = Dimensions.get("screen");

	const colorScheme = useColorScheme();

	const height = useSharedValue(0);

	const animatedBottomView = useAnimatedStyle(() => {
		return {
			height: height.value,
		};
	});

	const animatedTopView = useAnimatedStyle(() => {
		const value = interpolate(height.value, [0, screenHeight * 0.4], [0, 20]);
		return {
			borderBottomStartRadius: value,
			borderBottomEndRadius: value,
		};
	});
	const { bottom } = useSafeAreaInsets();

	const animatedButtonView = useAnimatedStyle(() => {
		return {
			opacity: interpolate(height.value, [0, screenHeight * 0.4], [1, 0]),
			transform: [
				{
					translateX: -width / 2,
				},
				{
					translateY: interpolate(
						height.value,
						[0, screenHeight * 0.4],
						[0, 100],
					),
				},
				{
					scale: interpolate(height.value, [0, screenHeight * 0.4], [1, 0.5]),
				},
			],

			position: "absolute",
			left: "50%",
			bottom: bottom,
			width: width, // Adding padding of 40 on each side
		};
	});

	const animatedImageStyle = useAnimatedStyle(() => ({
		height: interpolate(
			height.value,
			[0, screenHeight * 0.4],
			[screenHeight, screenHeight * 0.6],
		),
		transform: [
			{
				translateY: interpolate(
					height.value,
					[0, screenHeight * 0.4],
					[0, -screenHeight * 0.1],
				),
			},
		],
	}));

	const router = useRouter();

	if (!image) return null;

	return (
		<View className="flex-1 bg-background">
			<Animated.View
				style={animatedTopView}
				className="relative flex-1 rounded-b-3xl overflow-hidden"
			>
				<View className="absolute top-safe right-2 z-50 px-2 py-2 flex items-center justify-center">
					<ThemeToggle />
				</View>
				<BlurredImage />
				{/* <Image source={image} style={{ height: "100%" }} /> */}
				<Animated.View
					style={[animatedButtonView]}
					className="h-16 justify-center items-center"
				>
					<Button
						onPress={() => {
							trigger("clockTick");
							height.value = withTiming(screenHeight * 0.4, {
								duration: 800 * 2,
								easing: Easing.out(Easing.poly(9)),
							});
						}}
						className="w-[80%] rounded-xl !h-full "
					>
						<Text className="!text-lg">Get Started</Text>
					</Button>
				</Animated.View>
			</Animated.View>
			<Animated.View
				style={animatedBottomView}
				className={
					"flex flex-col justify-around px-10 bg-background relative items-center"
				}
			>
				<Text className="text-center text-2xl font-bold">
					Create an account
				</Text>
				<Button
					onPress={() => {
						trigger("clockTick");
						router.push("/get-started");
					}}
					className="flex flex-row gap-2 items-center"
				>
					<Mail className="text-background" />
					<Text className="font-semibold">Continue with email</Text>
				</Button>
				<View className="text-center text-lg font-light flex items-center flex-row">
					<Text>Already have an account? </Text>
					<Button variant={"link"}>
						<Text className="font-semibold">Sign In</Text>
					</Button>
				</View>
			</Animated.View>
		</View>
	);
}
