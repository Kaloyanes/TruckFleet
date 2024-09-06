import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';

import 'package:get/get.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:truck_fleet_mobile/app/data/app_translation.dart';
import 'package:truck_fleet_mobile/themes.dart';
import 'package:window_rounded_corners/window_rounded_corners.dart';

import 'app/routes/app_pages.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  Animate.restartOnHotReload = true;

  if (Platform.isAndroid) await WindowCorners.init();

  GoogleFonts.config.allowRuntimeFetching = false;
  debugDefaultTargetPlatformOverride = TargetPlatform.iOS;
  runApp(
    const App(),
  );
}

class App extends StatelessWidget {
  const App({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.edgeToEdge);
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
    ]);

    return GetMaterialApp(
      title: "Application",
      initialRoute: AppPages.INITIAL,
      getPages: AppPages.routes,
      theme: lightTheme(),
      darkTheme: darkTheme(),
      locale: Get.deviceLocale,
      fallbackLocale: const Locale("en", "US"),
      translations: LocalMessages(),
      builder: (context, child) {
        // Get the current brightness
        final brightness = MediaQuery.of(context).platformBrightness;

        // Set the status bar icon brightness based on the device brightness
        SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: brightness == Brightness.light ? Brightness.dark : Brightness.light,
          systemStatusBarContrastEnforced: false,
          systemNavigationBarColor: Colors.transparent,
          systemNavigationBarContrastEnforced: false,
        ));

        return child!;
      },
    );
  }
}
