import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "Truck Fleet",
  slug: "truck-fleet-mobile",
  description: "Truck Fleet Mobile App",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/adaptive-icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  locales: {
    en: "./locales/en.json",
    bg: "./locales/bg.json",
  },
  platforms: ["ios", "android"],
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.kaloyanes.truckfleetmobile",
    googleServicesFile: "./GoogleService-Info.plist",
    infoPlist: {
      UIBackgroundModes: ["location", "fetch", "audio"],
      NSLocationWhenInUseUsageDescription: {
        en: "We need your location to track the truck position.",
        bg: "Нуждаем се от местоположението ви за проследяване на позицията на камиона.",
      },
      NSLocationAlwaysAndWhenInUseUsageDescription: {
        en: "We need your location to track the truck position.",
        bg: "Нуждаем се от местоположението ви за проследяване на позицията на камиона.",
      },
    },
    icon: {
      dark: "./assets/icons/ios-dark.png",
      light: "./assets/icons/ios-light.png",
      tinted: "./assets/icons/ios-tinted.png",
    },
    config: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    },
  },
  android: {
    softwareKeyboardLayoutMode: "resize",
    adaptiveIcon: {
      foregroundImage: "./assets/icons/adaptive-icon.png",
      backgroundColor: "#ffffff",
      monochromeImage: "./assets/icons/adaptive-icon.png",
    },
    permissions: [
      "ACCESS_BACKGROUND_LOCATION",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
    ],
    package: "com.kaloyanes.truck_fleet_mobile",
    googleServicesFile: "./google-services.json",
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
      },
    },
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-font",
    "expo-localization",
    "@react-native-firebase/app",
    "@react-native-firebase/auth",
    "@react-native-firebase/crashlytics",
    [
      "expo-build-properties",
      {
        android: {
          compileSdkVersion: 35,
          targetSdkVersion: 35,
          minSdkVersion: 24,
          buildToolsVersion: "35.0.0",
          // kotlinVersion: "2.0.2",
        },
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission: {
          en: "Allow $(PRODUCT_NAME) to use your location to track trucks.",
          bg: "Позволете на $(PRODUCT_NAME) да използва местоположението ви за проследяване на камиона.",
        },
        locationAlwaysPermission: {
          en: "Allow $(PRODUCT_NAME) to use your location.",
          bg: "Позволете на $(PRODUCT_NAME) да използва местоположението ви.",
        },
        locationWhenInUsePermission: {
          en: "Allow $(PRODUCT_NAME) to use your location.",
          bg: "Позволете на $(PRODUCT_NAME) да използва местоположението ви.",
        },
        isIosBackgroundLocationEnabled: true,
        isAndroidBackgroundLocationEnabled: true,
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#ffffff",
        image: "./assets/icons/splash-icon-dark.png",
        dark: {
          image: "./assets/icons/splash-icon-light.png",
          backgroundColor: "#09090B",
        },
        imageWidth: 200,
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: {
          en: "The app accesses your photos to show your photo with the company.",
          bg: "Приложението достъпва снимките ви, за да покаже вашата снимка с компанията.",
        },
        cameraPermission: {
          en: "The app accesses your camera to take a photo for your profile.",
          bg: "Приложението достъпва камерата ви, за да направи снимка за вашия профил.",
        },
      },
    ],
    "expo-quick-actions",
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-document-picker",
      {
        iCloudContainerEnvironment: "Production",
      },
    ],
    [
      "expo-audio",
      {
        microphonePermission: {
          en: "Allow $(PRODUCT_NAME) to access your microphone.",
          bg: "Позволете на $(PRODUCT_NAME) да достъпва вашия микрофон.",
        },
      },
    ],
    "react-native-map-link",
    [
      "expo-media-library",
      {
        photosPermission: {
          en: "Allow $(PRODUCT_NAME) to access your photos.",
          bg: "Позволете на $(PRODUCT_NAME) да достъпва вашите снимки.",
        },
        savePhotosPermission: {
          en: "Allow $(PRODUCT_NAME) to save photos.",
          bg: "Позволете на $(PRODUCT_NAME) да запазва вашите снимки.",
        },
        isAccessMediaLocationEnabled: true,
      },
    ],
    "react-native-legal",
  ],
  experiments: {
    typedRoutes: true,
  },
});
