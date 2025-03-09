import { forwardRef } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";
import Animated from "react-native-reanimated";

export const BodyScrollView = forwardRef<any, ScrollViewProps>((props, ref) => {
	return (
		<Animated.ScrollView
			automaticallyAdjustsScrollIndicatorInsets
			contentInsetAdjustmentBehavior="automatic"
			contentInset={{ bottom: 0 }}
			scrollIndicatorInsets={{ bottom: 0 }}
			{...props}
			ref={ref}
		/>
	);
});
