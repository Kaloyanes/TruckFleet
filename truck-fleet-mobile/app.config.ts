import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  name: "Truck Fleet",
  slug: "truck-fleet-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icons/adaptive-icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.kaloyanes.truckfleetmobile",
    googleServicesFile: "./GoogleService-Info.plist",
    infoPlist: {
      UIBackgroundModes: ["location", "fetch"],
      NSLocationWhenInUseUsageDescription:
        "We need your location to track the truck position.",
      NSLocationAlwaysAndWhenInUseUsageDescription:
        "We need your location to track the truck position.",
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
          kotlinVersion: "1.9.25",
        },
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location to track trucks.",
        locationAlwaysPermission: "Allow $(PRODUCT_NAME) to use your location.",
        locationWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
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
        photosPermission:
          "The app accesses your photos to show your photo with the company.",
        cameraPermission:
          "The app accesses your camera to take a photo for your profile.",
      },
    ],
    "expo-quick-actions",
  ],
  experiments: {
    typedRoutes: true,
  },
});
