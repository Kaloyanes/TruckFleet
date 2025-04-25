import Animated, {
	Easing,
	FadeIn,
	FadeOut,
	useAnimatedStyle,
	useDerivedValue,
	withSequence,
	withTiming,
	useSharedValue,
} from "react-native-reanimated";
import { Overlay } from "./components/overlay";
import { useImmersiveOverlayStore } from "./store";
import { useEffect } from "react";

export const ImmersiveOverlay = ({
	children,
}: { children: React.ReactNode }) => {
	const { displayImmersiveOverlay } = useImmersiveOverlayStore();
	const isMounted = useSharedValue(true);

	// This give us our 'warp' effect.
	const intensity = 0.05;
	const progress = useDerivedValue(() => {
		if (!isMounted.value) return 0;

		if (displayImmersiveOverlay.value) {
			return withSequence(
				withTiming(1, {
					duration: 300,
					easing: Easing.bezier(0.65, 0, 0.35, 1),
				}),
				withTiming(0, {
					duration: 1500,
					easing: Easing.bezier(0.22, 1, 0.36, 1),
				}),
			);
		}
		return withTiming(0, { duration: 300 });
	});

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ rotateX: `${progress.value * -5}deg` },
				{ skewY: `${-progress.value * 1.5}deg` },
				{ scaleY: 1 + progress.value * intensity },
				{ scaleX: 1 - progress.value * intensity * 0.6 },
			],
		};
	});

	useEffect(() => {
		return () => {
			isMounted.value = false;
		};
	}, [isMounted]);

	return (
		<>
			{/* This is our overlay component, the main animation */}
			<Overlay />
			{/* our children, where the 'warp' effect takes place. */}
			<Animated.View
				style={[
					{
						flex: 1,
						transformOrigin: "top",
					},
					animatedStyle,
				]}
				className={"bg-background"}
				entering={FadeIn}
				exiting={FadeOut}
			>
				{children}
			</Animated.View>
		</>
	);
};
