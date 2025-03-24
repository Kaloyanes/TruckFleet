import "~/global.css";

import {
	DarkTheme,
	DefaultTheme,
	type Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as React from "react";
import { Platform, View, Pressable, PlatformColor } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as NavigationBar from "expo-navigation-bar";
import LanguageSelector from "~/components/LanguageSelector";
import { useRegisterStore } from "~/stores/register-store";
import { Progress } from "~/components/ui/progress";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { Toaster } from "sonner-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { firebase } from "@react-native-firebase/firestore";
import * as QuickActions from "expo-quick-actions";

import { useQuickActionRouting } from "expo-quick-actions/router";
import { enableFreeze } from "react-native-screens";
import { Text } from "~/components/ui/text";

const LIGHT_THEME: Theme = {
	...DefaultTheme,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	...DarkTheme,
	colors: NAV_THEME.dark,
};

enableFreeze(false);
export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
	// Ensure any route can link back to `/`
	initialRouteName: "/on-board",
};

globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

export default function RootLayout() {
	// register expo quick actions
	useQuickActionRouting();

	const { top } = useSafeAreaInsets();
	const { t } = useTranslation();
	const hasMounted = React.useRef(false);
	const { colorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const [fontsLoaded] = useFonts({
		Satoshi: require("~/assets/fonts/Satoshi-Variable.ttf"),
		Manrope: require("~/assets/fonts/Manrope.ttf"),
	});

	React.useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.setOptions({
				fade: true,
				duration: 150,
			});
			SplashScreen.hideAsync();
			return;
		}
	}, [fontsLoaded]);

	React.useEffect(() => {
		(async () => {
			await firebase.firestore().settings({
				cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
				persistence: true,
			});
		})();

		QuickActions.setItems([
			{
				title: "Wait! Don't delete me!",
				subtitle: "We're here to help",
				id: "del",
				icon:
					Platform.OS === "ios"
						? "symbol:person.crop.circle.badge.questionmark.fill"
						: "ic_shortcut",
				params: {
					href: "/feedback",
				},
			},
		]);
	}, []);

	React.useLayoutEffect(() => {
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
									fontFamily: "Manrope",
								},
								headerTitleStyle: {
									fontFamily: "Manrope",
								},
								headerShadowVisible: false,
								headerTransparent: true,
								headerBlurEffect: "prominent",

								headerLargeStyle: {
									backgroundColor: "transparent",
								},
								headerTitleAlign: "center",
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
									sheetCornerRadius: 25,
									sheetGrabberVisible: true,
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
							<Stack.Screen
								name="(chat)/[id]"
								options={{
									headerShadowVisible: false,
									headerBackTitle: t("chat"),
									headerStyle: {
										backgroundColor: "transparent",
									},
									title: "",

									headerLargeTitle: false,
									headerBackButtonDisplayMode: "minimal",
									keyboardHandlingEnabled: true,
									headerBlurEffect: "none",
									headerBackground: () => (
										<View className="w-full h-full relative">
											<BlurView
												className="w-full h-full pb-4 android:bg-background"
												intensity={80}
												tint="prominent"
											/>
										</View>
									),
								}}
							/>
							<Stack.Screen
								name="(chat)/new-chat"
								options={{
									sheetCornerRadius: 25,
									sheetGrabberVisible: true,
									presentation: "formSheet",
									sheetAllowedDetents: Platform.OS === "ios" ? [0.5, 1] : [0.9],
									gestureDirection: "vertical",
									headerShadowVisible: false,
									headerLargeTitleShadowVisible: false,
									title: t("chats.new_chat"),
									headerLargeTitle: true,
								}}
							/>
							<Stack.Screen
								name="feedback"
								options={{
									headerShadowVisible: false,
									headerLargeTitle: true,
									title: "Feedback",
									presentation: "modal",
								}}
							/>
						</Stack>
						<PortalHost />
						<Toaster
							closeButton
							richColors
							swipeToDismissDirection="up"
							gap={15}
							autoWiggleOnUpdate="always"
							offset={top}
						/>
					</View>
				</ThemeProvider>
			</KeyboardProvider>
		</GestureHandlerRootView>
	);
}
