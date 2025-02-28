import "~/global.css";

import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View, Pressable } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useFonts } from "expo-font";
import {
	PlayfairDisplay_400Regular,
	PlayfairDisplay_400Regular_Italic,
	PlayfairDisplay_600SemiBold,
	PlayfairDisplay_600SemiBold_Italic,
	PlayfairDisplay_800ExtraBold,
	PlayfairDisplay_800ExtraBold_Italic,
} from "@expo-google-fonts/playfair-display";
import i18n from "~/locales/i18n";
import * as NavigationBar from "expo-navigation-bar";
import LanguageSelector from "~/components/LanguageSelector";
import { useRegisterStore } from "~/stores/register-store";
import { Text } from "~/components/ui/text";
import { Progress } from "~/components/ui/progress";
import { useTranslation } from "react-i18next";
import { router, usePathname } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

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

export default function RootLayout() {
	const { t } = useTranslation();
	const hasMounted = React.useRef(false);
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const [fontsLoaded] = useFonts({
		PlayfairDisplay_400Regular,
		PlayfairDisplay_400Regular_Italic,
		PlayfairDisplay_600SemiBold,
		PlayfairDisplay_600SemiBold_Italic,
		PlayfairDisplay_800ExtraBold,
		PlayfairDisplay_800ExtraBold_Italic,
	});

	React.useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
			return;
		}
	}, [fontsLoaded]);

	useIsomorphicLayoutEffect(() => {
		if (hasMounted.current) {
			return;
		}

		if (Platform.OS === "web") {
			// Adds the background color to the html element to prevent white background on overscroll.
			document.documentElement.classList.add("bg-background");
		}

		if (Platform.OS === "android") NavigationBar.setPositionAsync("absolute");
		setIsColorSchemeLoaded(true);
		hasMounted.current = true;
	}, []);

	if (!isColorSchemeLoaded) {
		return null;
	}

	const RegisterBackButton = () => {
		// Use a hook within the component to ensure it has access to the React context
		const { currentIndex, setCurrentIndex, setButtonDisabled } =
			useRegisterStore();

		const handleBackPress = () => {
			impactAsync(ImpactFeedbackStyle.Light);
			if (currentIndex > 0) {
				setCurrentIndex(currentIndex - 1);
				setButtonDisabled(false);
			} else {
				router.back();
			}
		};

		return (
			<Pressable onPress={handleBackPress} className="ml-2 p-2">
				<ChevronLeft
					size={24}
					color={colorScheme === "dark" ? "white" : "black"}
				/>
			</Pressable>
		);
	};

	return (
		// <GestureHandlerRootView style={{ flex: 1 }}>
		<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
			<View className="bg-background flex-1">
				<StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
				<Stack
					initialRouteName="on-board"
					screenOptions={{
						headerLargeTitleStyle: {
							fontFamily: "PlayfairDisplay_600SemiBold",
						},
					}}
				>
					<Stack.Screen
						name="on-board"
						options={{
							headerShown: false,
							title: "",
						}}
					/>
					<Stack.Screen
						name="(tabs)"
						options={{
							title: t("home"),
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="(auth)/login"
						options={{
							title: t("sign_in_title"),
							headerLargeTitle: true,
							headerShadowVisible: false,
						}}
					/>
					<Stack.Screen
						name="(auth)/register"
						options={{
							headerShadowVisible: false,
							headerLeft: () => <RegisterBackButton />,
							headerTitle(props) {
								const { progress } = useRegisterStore();
								return (
									<View className="items-center justify-center flex-1 mr-4">
										<Progress value={progress} className="w-full" />
									</View>
								);
							},
							headerRight: () => (
								<View className="flex flex-row gap-4">
									<LanguageSelector />
									<ThemeToggle />
								</View>
							),
						}}
					/>
					<Stack.Screen
						name="(auth)/pick-image"
						options={{
							sheetCornerRadius: 50,

							sheetGrabberVisible: true,
							sheetElevation: 50,
							presentation: "formSheet",
							sheetAllowedDetents: [0.75, 1],
							title: "Pick Method",
							gestureDirection: "vertical",
							headerLargeTitle: true,
							headerShadowVisible: false,
							headerLargeTitleShadowVisible: false,
						}}
					/>
				</Stack>
				<PortalHost />
			</View>
		</ThemeProvider>
		// </GestureHandlerRootView>
	);
}

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;
