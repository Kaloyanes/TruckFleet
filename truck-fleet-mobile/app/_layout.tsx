import "~/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { setPositionAsync } from "expo-navigation-bar";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const theme = await AsyncStorage.getItem("theme");
			if (Platform.OS === "web") {
				// Adds the background color to the html element to prevent white background on overscroll.
				document.documentElement.classList.add("bg-background");
			}
			if (!theme) {
				AsyncStorage.setItem("theme", colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			setIsColorSchemeLoaded(true);
		})().finally(() => {
			SplashScreen.hideAsync();
		});
	}, [colorScheme, setColorScheme]);

	if (!isColorSchemeLoaded) {
		return null;
	}

	return (
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<Stack
				initialRouteName="get-started/index"
				screenOptions={{
					headerShadowVisible: false,
					keyboardHandlingEnabled: true,
				}}
			>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
						contentStyle: {
							flex: 1,
						},
					}}
				/>
				<Stack.Screen
					name="get-started/index"
					options={{
						headerTitle: "",
						contentStyle: {
							flex: 1,
						},
						headerBackground: () => <View className="flex-1 bg-background" />,
						headerRight: () => <ThemeToggle />,
					}}
				/>
			</Stack>
			<PortalHost />
		</ThemeProvider>
	);
}
