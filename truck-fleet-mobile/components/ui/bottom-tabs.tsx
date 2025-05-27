import { withLayoutContext } from "expo-router";
import {
	createNativeBottomTabNavigator,
	type NativeBottomTabNavigationOptions,
	type NativeBottomTabNavigationEventMap,
} from "@bottom-tabs/react-navigation";
import type {
	ParamListBase,
	TabNavigationState,
} from "@react-navigation/native";

const BottomTabNavigator = createNativeBottomTabNavigator().Navigator;

export const Tabs = withLayoutContext<
	NativeBottomTabNavigationOptions,
	typeof BottomTabNavigator,
	TabNavigationState<ParamListBase>,
	NativeBottomTabNavigationEventMap
>(BottomTabNavigator);
