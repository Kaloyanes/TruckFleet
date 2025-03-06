import "~/global.css";

import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { Link, Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, View, Pressable } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
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
import { ChevronLeft, TabletSmartphone } from "lucide-react-native";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import Toast, {
	BaseToast,
	ErrorToast,
	type ToastConfig,
} from "react-native-toast-message";
import {
	IconError404,
	IconExclamationCircle,
	IconExclamationCircleFilled,
	IconFaceIdError,
} from "@tabler/icons-react-native";
import { Toaster } from "sonner-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { firebase } from "@react-native-firebase/firestore";

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

SplashScreen.preventAutoHideAsync();
firebase.firestore().settings({
	cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
	persistence: true,
});

export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: "/on-board",
};

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

export default function RootLayout() {
	const { top } = useSafeAreaInsets();
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
			SplashScreen.setOptions({
				fade: true,
				duration: 150,
			});
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
		<GestureHandlerRootView>
			<KeyboardProvider>
				<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
					<View className="bg-background flex-1">
						{/* <StatusBar style={"auto"} /> */}

						<Stack
							screenListeners={{
								state: async (e) => {
									const previousRouteName =
										e.data.state.routes[e.data.state.index - 1].name;
									const currentRouteName =
										e.data.state.routes[e.data.state.index].name;

									if (previousRouteName !== currentRouteName) {
										// await logScreenView(getApp(), {
										// 	screen_name: currentRouteName,
										// 	screen_class: currentRouteName,
										// });
									}
								},
							}}
							screenOptions={{
								headerLargeTitleStyle: {
									fontFamily: "PlayfairDisplay_600SemiBold",
								},
								headerShadowVisible: false,

								headerTransparent: true,

								headerBackground() {
									if (Platform.OS === "android")
										return <View className="bg-background flex-1" />;

									return <BlurView intensity={20} className="flex-1" />;
								},
							}}
						>
							<Stack.Screen
								name="(tabs)"
								options={{
									title: t("home"),
									headerShown: false,
								}}
							/>
							<Stack.Screen
								name="on-board"
								options={{
									headerShown: false,
									title: "",
								}}
							/>
							<Stack.Screen
								name="(auth)/login"
								options={{
									title: "",
									headerShadowVisible: false,
									headerRight: () => (
										<View className="flex flex-row gap-4">
											<LanguageSelector />
											<ThemeToggle />
										</View>
									),
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
									sheetAllowedDetents: Platform.OS === "ios" ? [1] : [0.9],
									gestureDirection: "vertical",
									headerShadowVisible: false,
									headerLargeTitleShadowVisible: false,
									title: t("pick_image"),
								}}
							/>
							<Stack.Screen
								name="(auth)/forgot-password"
								options={{ presentation: "modal" }}
							/>
						</Stack>
						<PortalHost />
						<Toaster
							closeButton
							richColors
							swipeToDismissDirection="up"
							gap={15}
							autoWiggleOnUpdate="always"
							offset={top - 10}
						/>
					</View>
				</ThemeProvider>
			</KeyboardProvider>
		</GestureHandlerRootView>
	);
}

const useIsomorphicLayoutEffect =
	Platform.OS === "web" && typeof window === "undefined"
		? React.useEffect
		: React.useLayoutEffect;
