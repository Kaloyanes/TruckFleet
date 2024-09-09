import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:truck_fleet_mobile/app/data/app_translation.dart';
import 'package:truck_fleet_mobile/firebase_options.dart';
import 'package:truck_fleet_mobile/themes.dart';
import 'package:window_rounded_corners/window_rounded_corners.dart';

import 'app/routes/app_pages.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Animate.restartOnHotReload = true;

  GoogleFonts.config.allowRuntimeFetching = false;
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  await GetStorage.init("settings_truck_fleet");

  runApp(
    App(),
  );
}

class App extends StatelessWidget {
  App({
    super.key,
  });

  final storage = GetStorage("settings_truck_fleet");

  @override
  Widget build(BuildContext context) {
    setupInsets(context);

    return GetMaterialApp(
      title: "Application",
      initialRoute: AppPages.INITIAL,
      getPages: AppPages.routes,
      theme: theme(colorScheme: lightColorScheme),
      darkTheme: theme(),
      themeMode: getThemeMode(),
      locale: storage.read("language") == null ? Get.deviceLocale : Locale(storage.read("language")),
      fallbackLocale: const Locale("en", "US"),
      translations: LocalMessages(),
    );
  }

  ThemeMode getThemeMode() {
    if (storage.read("theme") == null) {
      return ThemeMode.system;
    }

    switch (storage.read("theme")) {
      case "light":
        return ThemeMode.light;
      case "dark":
        return ThemeMode.dark;
      case "system":
      default:
        return ThemeMode.system;
    }
  }

  void setupInsets(BuildContext context) {
    final isSmall = MediaQuery.sizeOf(context).shortestSide / MediaQuery.devicePixelRatioOf(context) < 600;

    final orientations = [
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ];

    if (!isSmall) {
      orientations.addAll([
        DeviceOrientation.landscapeLeft,
        DeviceOrientation.landscapeRight,
      ]);
    }

    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    SystemChrome.setPreferredOrientations(orientations);

    final brightness = Theme.of(context).colorScheme.brightness;

    // Set the status bar icon brightness based on the device brightness
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: brightness == Brightness.light ? Brightness.dark : Brightness.light,
      systemStatusBarContrastEnforced: false,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarContrastEnforced: false,
    ));
  }
}